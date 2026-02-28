import React from "react";
import { useState } from "react";
import "../styles/Cart.css";
import { useEffect } from "react";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    return (
        <div className="cart-container">
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item._id} className="cart-item">
                            <div className="item-image">
                                <img src={item.images?.[0] || "/placeholder.png"} alt={item.title} />
                            </div>
                            <div className="item-details">
                                <h3>{item.title}</h3>
                                <p>Price: ₹{item.discountedPrice}</p>
                                <p>Quantity: {item.quantity}</p>
                                <button className="btn btn-danger">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Cart;