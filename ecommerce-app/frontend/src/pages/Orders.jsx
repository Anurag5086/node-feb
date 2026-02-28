import React from "react";
import { useState } from "react";
import "../styles/Orders.css";
import axios from "axios";
import { useEffect } from "react";

const Orders = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = () => {
        axios.get(`http://localhost:3000/api/orders`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
        })
            .then(response => {
                console.log("Fetched orders:", response.data);
                setOrders(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching orders!", error);
            });
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="orders-container">
            <h1>My Orders</h1>
            <div className="orders-list">
                {orders?.map(order => (
                    <div key={order._id} className="order-card">
                        <h3>Order ID: {order._id}</h3>
                        <p>Total Amount Paid: ₹{order.totalAmount}</p>
                        <p>Payment Method: {order.paymentMethod}</p>
                        <p className={`order-status ${order.status ? order.status.toLowerCase().replace(/\s+/g, '-') : ''}`}>Order Status: {order.status}</p>
                        <div className="ordered-products">
                            <h4>Products:</h4>
                            {order.products.map((item, index) => (
                                <div key={index} className="ordered-product">
                                    <p>{item.productId.title} (x{item.quantity})</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Orders;
