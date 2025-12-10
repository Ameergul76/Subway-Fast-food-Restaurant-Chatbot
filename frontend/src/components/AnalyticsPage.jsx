import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getAnalytics, getOrderStatistics } from '../api';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#22c55e', '#ef4444'];

const AnalyticsPage = () => {
    const [analyticsData, setAnalyticsData] = useState([]);
    const [orderStats, setOrderStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [analyticsRes, statsRes] = await Promise.all([
                getAnalytics(),
                getOrderStatistics()
            ]);
            setAnalyticsData(analyticsRes.data);
            setOrderStats(statsRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">📊 Analytics Dashboard</h2>
                <p>Loading analytics data...</p>
            </div>
        );
    }

    // Prepare pie chart data for order status
    const orderStatusData = orderStats ? [
        { name: 'Pending', value: orderStats.pending, color: '#f59e0b' },
        { name: 'Preparing', value: orderStats.preparing, color: '#3b82f6' },
        { name: 'Ready', value: orderStats.ready, color: '#10b981' },
        { name: 'Completed', value: orderStats.completed, color: '#22c55e' },
        { name: 'Cancelled', value: orderStats.cancelled, color: '#ef4444' }
    ].filter(item => item.value > 0) : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
                <h1 className="text-3xl font-bold">📊 Analytics Dashboard</h1>
                <p className="text-emerald-100 mt-2">Real-time insights into your restaurant performance</p>
                <p className="text-sm text-emerald-200 mt-1">Auto-updates every 5 seconds</p>
            </div>

            {/* Order Status Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-amber-500">
                    <p className="text-sm text-gray-500">⏳ Pending</p>
                    <p className="text-3xl font-bold text-amber-600">{orderStats?.pending || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-500">👨‍🍳 Preparing</p>
                    <p className="text-3xl font-bold text-blue-600">{orderStats?.preparing || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-emerald-500">
                    <p className="text-sm text-gray-500">✅ Ready</p>
                    <p className="text-3xl font-bold text-emerald-600">{orderStats?.ready || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                    <p className="text-sm text-gray-500">🎉 Completed</p>
                    <p className="text-3xl font-bold text-green-600">{orderStats?.completed || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
                    <p className="text-sm text-gray-500">❌ Cancelled</p>
                    <p className="text-3xl font-bold text-red-600">{orderStats?.cancelled || 0}</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Status Pie Chart */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">📈 Order Status Distribution</h3>
                    {orderStatusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={orderStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-500 text-center py-10">No orders yet</p>
                    )}
                </div>

                {/* Revenue Summary */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">💰 Revenue Summary</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-emerald-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-600">Total Items Sold</p>
                            <p className="text-3xl font-bold text-emerald-600">
                                {analyticsData.reduce((sum, item) => sum + (item.quantity || 0), 0)}
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-600">Total Revenue</p>
                            <p className="text-3xl font-bold text-green-700">
                                ${analyticsData.reduce((sum, item) => sum + (item.income || 0), 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="text-3xl font-bold text-gray-700">{orderStats?.total || 0}</p>
                    </div>
                </div>
            </div>

            {/* Bar Charts */}
            {analyticsData.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Quantity Chart */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">🍽️ Orders by Item (Quantity)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analyticsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="quantity" fill="#10b981" name="Quantity Sold" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Income Chart */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">💵 Revenue by Item</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analyticsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                <YAxis />
                                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                <Legend />
                                <Bar dataKey="income" fill="#059669" name="Revenue ($)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {analyticsData.length === 0 && (
                <div className="bg-white shadow rounded-lg p-6 text-center">
                    <p className="text-gray-500">No sales data available yet. Place some orders to see analytics!</p>
                </div>
            )}
        </div>
    );
};

export default AnalyticsPage;
