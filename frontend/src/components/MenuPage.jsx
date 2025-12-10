import React, { useState, useEffect } from 'react';
import { getMenu, createOrder, createMenuItem, deleteMenuItem, getCategories, createCategory } from '../api';

// Category-based default images
const categoryImages = {
    'pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    'pasta': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400',
    'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    'sandwich': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400',
    'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    'beverage': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
    'drink': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
    'dessert': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400',
    'sides': 'https://images.unsplash.com/photo-1630431341973-02e1b662ec35?w=400',
    'chicken': 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400',
    'soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    'default': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
};

// Category icons
const categoryIcons = {
    'Pizza': '🍕',
    'Pasta': '🍝',
    'Salad': '🥗',
    'Sandwich': '🥪',
    'Burger': '🍔',
    'Beverage': '🥤',
    'Dessert': '🍰',
    'Sides': '🍟',
    'All': '📋'
};

// Get image based on item name or category
// Get image based on item name or category
const getItemImage = (item, backendCategories = []) => {
    // Check backend categories first
    const backendCat = backendCategories.find(c => c.name === item.category);
    if (backendCat && backendCat.image_url) return backendCat.image_url;

    const itemLower = item.item.toLowerCase();
    const categoryLower = item.category.toLowerCase();

    for (const [key, url] of Object.entries(categoryImages)) {
        if (itemLower.includes(key)) return url;
    }
    for (const [key, url] of Object.entries(categoryImages)) {
        if (categoryLower.includes(key)) return url;
    }
    return categoryImages.default;
};

function MenuPage() {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState({});
    const [userDetails, setUserDetails] = useState('');
    const [loading, setLoading] = useState(true);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({ item: '', category: '', price: '', description: '' });
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [deleting, setDeleting] = useState(null);

    const [backendCategories, setBackendCategories] = useState([]);
    const [newCategoryImage, setNewCategoryImage] = useState('');

    useEffect(() => {
        fetchMenu();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setBackendCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchMenu = async () => {
        try {
            const response = await getMenu();
            setMenuItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching menu:', error);
            setLoading(false);
        }
    };

    // Get unique categories
    const categories = ['All', ...new Set(menuItems.map(item => item.category))];

    // Filter items by selected category
    const filteredItems = selectedCategory === 'All'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);

    const addToCart = (item) => {
        setCart((prevCart) => ({
            ...prevCart,
            [item.id]: (prevCart[item.id] || 0) + 1,
        }));
    };

    const removeFromCart = (item) => {
        setCart((prevCart) => {
            const newCart = { ...prevCart };
            if (newCart[item.id] > 1) {
                newCart[item.id] -= 1;
            } else {
                delete newCart[item.id];
            }
            return newCart;
        });
    };

    const calculateTotal = () => {
        return Object.entries(cart).reduce((total, [itemId, quantity]) => {
            const item = menuItems.find((i) => i.id === parseInt(itemId));
            return total + (item ? item.price * quantity : 0);
        }, 0);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!userDetails) {
            alert('Please enter your details');
            return;
        }

        const items = Object.entries(cart).map(([itemId, quantity]) => ({
            item_id: parseInt(itemId),
            quantity: quantity,
        }));

        try {
            await createOrder({
                user_details: userDetails,
                items: items,
            });
            setOrderPlaced(true);
            setCart({});
            setUserDetails('');
            setTimeout(() => setOrderPlaced(false), 3000);
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order');
        }
    };

    const handleAddMenuItem = async (e) => {
        e.preventDefault();
        try {
            // Check if it's a new category
            const existingCategory = backendCategories.find(c => c.name === newItem.category);
            if (!existingCategory && newCategoryImage) {
                await createCategory({ name: newItem.category, image_url: newCategoryImage });
                // Refresh categories immediately
                await fetchCategories();
            }

            await createMenuItem({
                item: newItem.item,
                category: newItem.category,
                price: parseFloat(newItem.price),
                description: newItem.description
            });
            setNewItem({ item: '', category: '', price: '', description: '' });
            setNewCategoryImage('');
            setShowAddModal(false);
            fetchMenu();
        } catch (error) {
            console.error('Error adding menu item:', error);
            alert('Failed to add menu item');
        }
    };

    const handleDeleteMenuItem = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setDeleting(itemId);
            try {
                const response = await deleteMenuItem(itemId);
                console.log('Delete response:', response);
                // Remove from local state immediately for better UX
                setMenuItems(prev => prev.filter(item => item.id !== itemId));
                // Also remove from cart if exists
                setCart(prev => {
                    const newCart = { ...prev };
                    delete newCart[itemId];
                    return newCart;
                });
            } catch (error) {
                console.error('Error deleting menu item:', error);
                alert('Failed to delete menu item: ' + (error.response?.data?.detail || error.message));
                // Refresh menu to sync with server
                fetchMenu();
            } finally {
                setDeleting(null);
            }
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-500">Loading menu...</div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Fixed Header */}
            <div className="sticky top-0 z-40 bg-gray-100 pb-4 -mt-6 pt-6 -mx-6 px-6 lg:-mx-8 lg:px-8 shadow-sm">
                {/* Header Banner */}
                <div className="relative bg-gradient-to-r from-orange-500 to-red-500 rounded-xl overflow-hidden shadow-lg">
                    <div className="absolute inset-0 opacity-30">
                        <img
                            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200"
                            alt="Food"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="relative p-6 text-white flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">🥪 Order from Subway Fast Food</h1>
                            <p className="text-orange-100 text-sm mt-1">Select items to add to your order</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsAdmin(!isAdmin)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform active:scale-95 ${isAdmin
                                    ? 'bg-yellow-500 hover:bg-yellow-600 shadow-lg'
                                    : 'bg-white/20 hover:bg-white/30'
                                    }`}
                            >
                                {isAdmin ? '👨‍💼 Admin Mode' : '👤 Customer'}
                            </button>
                            {isAdmin && (
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                                >
                                    ➕ Add Item
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 transform active:scale-95 ${selectedCategory === category
                                ? 'bg-emerald-600 text-white shadow-lg scale-105'
                                : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 shadow'
                                }`}
                        >
                            <span>{categoryIcons[category] || '🍽️'}</span>
                            <span>{category}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category ? 'bg-white/20' : 'bg-gray-100'
                                }`}>
                                {category === 'All'
                                    ? menuItems.length
                                    : menuItems.filter(i => i.category === category).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {orderPlaced && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-pulse">
                    <span className="text-xl">✅</span>
                    Order placed successfully!
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Menu Items */}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredItems.map((item) => (
                            <div key={item.id} className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group ${deleting === item.id ? 'opacity-50' : ''}`}>
                                {/* Food Image */}
                                <div className="relative h-40 overflow-hidden">
                                    <img
                                        src={getItemImage(item, backendCategories)}
                                        alt={item.item}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 right-2 bg-emerald-500 text-white px-3 py-1 rounded-full font-bold shadow-lg">
                                        ${item.price}
                                    </div>
                                    <div className="absolute top-2 left-2 bg-gray-800/70 text-white px-2 py-1 rounded-full text-xs">
                                        {categoryIcons[item.category] || '🍽️'} {item.category}
                                    </div>
                                    {cart[item.id] && (
                                        <div className="absolute bottom-2 left-2 bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold animate-bounce">
                                            {cart[item.id]}
                                        </div>
                                    )}
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDeleteMenuItem(item.id)}
                                            disabled={deleting === item.id}
                                            className="absolute bottom-2 right-2 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 transform hover:scale-110 active:scale-90 shadow-lg disabled:opacity-50"
                                        >
                                            {deleting === item.id ? '⏳' : '🗑️'}
                                        </button>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg text-gray-800">{item.item}</h3>
                                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="mt-3 w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 active:bg-emerald-800 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                    >
                                        <span className="transition-transform group-hover:rotate-90">➕</span> Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl shadow">
                            <span className="text-6xl">🍽️</span>
                            <p className="text-gray-500 mt-4">No items in this category</p>
                        </div>
                    )}
                </div>

                {/* Cart - Sticky */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24 lg:top-48 z-20">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-2xl">🛒</span> Your Cart
                        </h3>
                        {Object.keys(cart).length === 0 ? (
                            <div className="text-center py-8">
                                <span className="text-6xl">🍽️</span>
                                <p className="text-gray-500 mt-4">Your cart is empty</p>
                                <p className="text-gray-400 text-sm mt-1">Add some delicious items!</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                    {Object.entries(cart).map(([itemId, quantity]) => {
                                        const item = menuItems.find((i) => i.id === parseInt(itemId));
                                        if (!item) return null;
                                        return (
                                            <div key={itemId} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors relative group">
                                                {/* Cross button to remove item */}
                                                <button
                                                    onClick={() => setCart(prev => {
                                                        const newCart = { ...prev };
                                                        delete newCart[itemId];
                                                        return newCart;
                                                    })}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-200 transform hover:scale-110 active:scale-90 shadow-md opacity-0 group-hover:opacity-100"
                                                    title="Remove item"
                                                >
                                                    ✕
                                                </button>
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={getItemImage(item, backendCategories)}
                                                        alt={item.item}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-sm">{item.item}</p>
                                                        <p className="text-xs text-gray-500">${item.price} × {quantity}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => removeFromCart(item)}
                                                        className="bg-red-100 text-red-600 w-7 h-7 rounded-full hover:bg-red-200 transition-all duration-200 transform active:scale-90 active:bg-red-300"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 text-center font-bold">{quantity}</span>
                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        className="bg-green-100 text-green-600 w-7 h-7 rounded-full hover:bg-green-200 transition-all duration-200 transform active:scale-90 active:bg-green-300"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="border-t pt-4 mb-4">
                                    <div className="flex justify-between items-center text-xl font-bold">
                                        <span>Total</span>
                                        <span className="text-emerald-600">${calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                                <form onSubmit={handlePlaceOrder} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Your Name / Table No.
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={userDetails}
                                            onChange={(e) => setUserDetails(e.target.value)}
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 p-3 border transition-all duration-200 focus:scale-[1.01]"
                                            placeholder="e.g. Table 5 or John"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <span>🛍️</span> Place Order
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Item Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl transform animate-slideUp">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">➕ Add New Menu Item</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleAddMenuItem} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newItem.item}
                                    onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                    placeholder="e.g. Veggie Delite Sandwich"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <input
                                    type="text"
                                    list="category-suggestions"
                                    required
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                    placeholder="Select or type a new category"
                                />
                                <datalist id="category-suggestions">
                                    <option value="Pizza" />
                                    <option value="Pasta" />
                                    <option value="Salad" />
                                    <option value="Sandwich" />
                                    <option value="Burger" />
                                    <option value="Beverage" />
                                    <option value="Dessert" />
                                    <option value="Sides" />
                                    {/* Add existing dynamic categories that might not be in the hardcoded list */}
                                    {categories.filter(c => c !== 'All').map(c => (
                                        <option key={c} value={c} />
                                    ))}
                                </datalist>
                                {/* Conditional Image Input for New Categories */}
                                {newItem.category &&
                                    !backendCategories.find(c => c.name === newItem.category) &&
                                    !Object.keys(categoryImages).some(k => newItem.category.toLowerCase().includes(k)) && (
                                        <div className="mt-2 animate-fadeIn">
                                            <label className="block text-sm font-medium text-emerald-600 mb-1">
                                                🆕 New Category Detected! Add an Image URL:
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={newCategoryImage}
                                                onChange={(e) => setNewCategoryImage(e.target.value)}
                                                className="w-full border-2 border-emerald-100 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-emerald-50/50"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                            <p className="text-xs text-emerald-500 mt-1">
                                                This image will be used for all items in this category.
                                            </p>
                                        </div>
                                    )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={newItem.price}
                                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                    placeholder="e.g. 8.99"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    value={newItem.description}
                                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                    rows="3"
                                    placeholder="Describe the item..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-all duration-300 transform active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg"
                                >
                                    Add Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
                .animate-slideUp { animation: slideUp 0.3s ease-out; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}

export default MenuPage;
