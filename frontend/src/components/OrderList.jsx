import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus, deleteOrder, getMenu } from '../api';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('all');

    const fetchOrders = async () => {
        try {
            const response = await getOrders();
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const fetchMenu = async () => {
        try {
            const response = await getMenu();
            setMenuItems(response.data);
        } catch (error) {
            console.error("Error fetching menu:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchMenu();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            fetchOrders();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                await deleteOrder(orderId);
                fetchOrders();
            } catch (error) {
                console.error("Error deleting order:", error);
                alert("Failed to delete order");
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-800';
            case 'Preparing': return 'bg-cyan-100 text-cyan-800';
            case 'Ready': return 'bg-emerald-100 text-emerald-800';
            case 'Completed': return 'bg-gray-100 text-gray-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Filter orders based on search query
    const filteredOrders = orders.filter(order => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();

        // Search by customer name
        if (order.user_details?.toLowerCase().includes(query)) return true;

        // Search by order ID
        if (order.id.toString().includes(query)) return true;

        // Search by status
        if (order.order_status?.toLowerCase().includes(query)) return true;

        // Search by menu item names
        const hasMatchingItem = order.items?.some(item =>
            item.menu_item?.item?.toLowerCase().includes(query)
        );
        if (hasMatchingItem) return true;

        return false;
    });

    // Filter menu items based on search
    const filteredMenuItems = menuItems.filter(item => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return item.item?.toLowerCase().includes(query) ||
            item.category?.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query);
    });

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white shadow rounded-lg p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search customers, orders, menu items, status..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSearchType('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${searchType === 'all' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setSearchType('orders')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${searchType === 'orders' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            📋 Orders
                        </button>
                        <button
                            onClick={() => setSearchType('menu')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${searchType === 'menu' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            🍽️ Menu
                        </button>
                    </div>
                </div>
                {searchQuery && (
                    <div className="mt-2 text-sm text-gray-500">
                        Found: {filteredOrders.length} orders, {filteredMenuItems.length} menu items
                    </div>
                )}
            </div>

            {/* Menu Search Results */}
            {searchQuery && (searchType === 'all' || searchType === 'menu') && filteredMenuItems.length > 0 && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span>🍽️</span> Menu Items ({filteredMenuItems.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredMenuItems.slice(0, 6).map(item => (
                            <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="bg-emerald-100 p-2 rounded-lg text-xl">🍕</div>
                                <div>
                                    <p className="font-medium">{item.item}</p>
                                    <p className="text-sm text-gray-500">{item.category} • ${item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Orders Table */}
            {(searchType === 'all' || searchType === 'orders') && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span>📋</span> Recent Orders {searchQuery && `(${filteredOrders.length})`}
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking Key</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            {searchQuery ? 'No orders found matching your search' : 'No orders yet'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{order.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-emerald-600 font-bold">{order.tracking_code || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.user_details}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {order.items.map(item => (
                                                    <div key={item.id}>
                                                        {item.quantity}x {item.menu_item ? item.menu_item.item : `Item ${item.item_id}`}
                                                        {item.menu_item && (
                                                            <span className="text-gray-400 ml-1">
                                                                (${(item.menu_item.price * item.quantity).toFixed(2)})
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total_amount.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.order_status)}`}>
                                                    {order.order_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <select
                                                    value={order.order_status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm mb-2"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Preparing">Preparing</option>
                                                    <option value="Ready">Ready</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;
