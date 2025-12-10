import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getAnalytics } from '../api';

const AnalyticsChart = () => {
    const [analyticsData, setAnalyticsData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            const response = await getAnalytics();
            setAnalyticsData(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching analytics:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
        // Auto-refresh every 5 seconds for live updates
        const interval = setInterval(fetchAnalytics, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
                <p>Loading analytics data...</p>
            </div>
        );
    }

    if (analyticsData.length === 0) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
                <p className="text-gray-500">No order data available yet. Place some orders to see analytics!</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
            <p className="text-sm text-gray-500 mb-4">Live data - updates every 5 seconds</p>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-emerald-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Items Sold</p>
                    <p className="text-2xl font-bold text-emerald-600">
                        {analyticsData.reduce((sum, item) => sum + (item.quantity || 0), 0)}
                    </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-700">
                        ${analyticsData.reduce((sum, item) => sum + (item.income || 0), 0).toFixed(2)}
                    </p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Menu Items</p>
                    <p className="text-2xl font-bold text-teal-600">
                        {analyticsData.length}
                    </p>
                </div>
            </div>

            {/* Quantity Chart */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Orders by Item (Quantity)</h3>
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
            <div>
                <h3 className="text-lg font-semibold mb-3">Revenue by Item</h3>
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
    );
};

export default AnalyticsChart;
