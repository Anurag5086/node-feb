import React from "react";
import { useState } from "react";
import "../styles/AdminDashboard.css";
import axios from "axios";
import { useEffect } from "react";
import { Link } from 'react-router-dom'

const STATUS_OPTIONS = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
];

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState({});
    const [updating, setUpdating] = useState({});

    const fetchOrders = () => {
        axios.get(`http://localhost:3000/api/orders/admin/orders`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(response => {
            console.log("Fetched orders for admin:", response.data);
            setOrders(response.data);
            // initialize selectedStatus map from fetched orders
            const map = {};
            response.data.forEach(o => map[o._id] = o.status || 'Pending');
            setSelectedStatus(map);
        })
        .catch(error => {
            console.error("There was an error fetching orders for admin!", error);
        });
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        // Redirect non-admin users away
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        if (!isAdmin) {
            window.location.href = '/'; // send non-admins to home
        }
    }, []);

    const handleStatusChange = (orderId, value) => {
        setSelectedStatus(prev => ({ ...prev, [orderId]: value }));
    }

    const updateOrderStatus = (orderId) => {
        const status = selectedStatus[orderId];
        if(!status) return;
        setUpdating(prev => ({ ...prev, [orderId]: true }));
        axios.put(`http://localhost:3000/api/orders/${orderId}`, { status }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            // replace order in local state with updated order
            setOrders(prev => prev.map(o => o._id === orderId ? response.data : o));
            console.log(`Order ${orderId} updated:`, response.data);
        })
        .catch(error => {
            console.error(`Failed to update order ${orderId}:`, error);
            alert('Failed to update order status. See console for details.');
        })
        .finally(() => setUpdating(prev => ({ ...prev, [orderId]: false })));
    }

    return (
        <div className="admin-dashboard-container">
                        <div className="d-flex justify-content-between align-items-center">
                            <h1>Admin Dashboard - All Orders</h1>
                            <div>
                                <Link to="/admin/categories" className="btn btn-secondary me-2">Manage Categories</Link>
                                <Link to="/admin/products" className="btn btn-outline-secondary">Manage Products</Link>
                            </div>
                        </div>

            <div className="orders-table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User ID</th>
                            <th>Total (₹)</th>
                            <th>Payment Method</th>
                            <th>Status</th>
                            <th>Products</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.length ? orders.map(order => (
                            <tr key={order._id} className={`order-row ${order.status ? order.status.toLowerCase().replace(/\s+/g,'-') : ''}`}>
                                <td>{order._id}</td>
                                <td>{order.userId}</td>
                                <td>{order.totalAmount}</td>
                                <td>{order.paymentMethod}</td>
                                <td>
                                    <select value={selectedStatus[order._id] || 'Pending'} onChange={e => handleStatusChange(order._id, e.target.value)}>
                                        {STATUS_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <ul className="product-list">
                                        {order.products?.map((item, idx) => (
                                            <li key={idx}>{item.productId?.title || 'Unknown'} (x{item.quantity})</li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <button onClick={() => updateOrderStatus(order._id)} disabled={!!updating[order._id]}>
                                        {updating[order._id] ? 'Updating...' : 'Update'}
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={7}>No orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default AdminDashboard;
