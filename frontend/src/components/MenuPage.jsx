import React, { useState, useEffect } from 'react';
import { getMenu, createOrder } from '../api';

function MenuPage() {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState({});
    const [userDetails, setUserDetails] = useState('');
    const [loading, setLoading] = useState(true);
    const [orderPlaced, setOrderPlaced] = useState(false);

    useEffect(() => {
        fetchMenu();
    }, []);

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

    if (loading) return <div className="p-4">Loading menu...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold mb-6">Our Menu</h2>

            {orderPlaced && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    Order placed successfully!
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Menu Items */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {menuItems.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg">{item.item}</h3>
                                    <p className="text-gray-500 text-sm">{item.category}</p>
                                </div>
                                <span className="font-bold text-indigo-600">${item.price}</span>
                            </div>
                            <p className="text-gray-600 mt-2 text-sm">{item.description}</p>
                            <button
                                onClick={() => addToCart(item)}
                                className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>

                {/* Cart */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200 sticky top-4">
                        <h3 className="text-xl font-bold mb-4">Your Cart</h3>
                        {Object.keys(cart).length === 0 ? (
                            <p className="text-gray-500">Your cart is empty</p>
                        ) : (
                            <>
                                <div className="space-y-4 mb-6">
                                    {Object.entries(cart).map(([itemId, quantity]) => {
                                        const item = menuItems.find((i) => i.id === parseInt(itemId));
                                        if (!item) return null;
                                        return (
                                            <div key={itemId} className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium">{item.item}</p>
                                                    <p className="text-sm text-gray-500">${item.price} x {quantity}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => removeFromCart(item)}
                                                        className="text-red-500 hover:text-red-700 px-2"
                                                    >
                                                        -
                                                    </button>
                                                    <span>{quantity}</span>
                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        className="text-green-500 hover:text-green-700 px-2"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="border-t pt-4 mb-6">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>${calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                                <form onSubmit={handlePlaceOrder}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Your Name / Table No.
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={userDetails}
                                            onChange={(e) => setUserDetails(e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                                            placeholder="e.g. Table 5"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                                    >
                                        Place Order
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MenuPage;
