import React from "react";
import { useState } from "react";
import "../styles/Cart.css";
import { useEffect } from "react";
import axios from "axios";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("Razorpay");
    const [productsWithQuantity, setProductsWithQuantity] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            const parsedCart = JSON.parse(storedCart);
            const productsWithQuantity = parsedCart.map(product => ({
                productId: product._id,
                quantity: product.quantity
            }));

            setCartItems(parsedCart);
            setProductsWithQuantity(productsWithQuantity);
        }
    }, []);

    const calculateTotalValue = () => {
        const total = cartItems.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
        setTotalValue(total);
    };

    // Dynamically load Razorpay checkout SDK
        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                if (window.Razorpay) return resolve(true);
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
        };

    const processRazorpay = async () => {
        if (totalValue <= 0) {
            alert("Cart is empty or total is zero.");
            return;
        }

        const loaded = await loadRazorpayScript();
        if (!loaded || !window.Razorpay) {
            alert("Failed to load Razorpay SDK. Check your connection or include the script in index.html.");
            return;
        }

        const options = {
            key: "rzp_test_RSS59NRVFBT6OO",
            amount: Math.round(totalValue * 100), // integer amount in paise
            currency: "INR",
            name: "Acciozon Private Limited",
            description: "Order Payment",
            image: "https://example.com/your_logo",
            handler: function (response) {
                alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
                axios.post(`http://localhost:3000/api/orders/create`, {
                    products: productsWithQuantity,
                    totalAmount: totalValue,
                    paymentMethod: "Razorpay",
                    razorpayPaymentId: response.razorpay_payment_id
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                .then(res => {
                    console.log("Order created successfully:", res.data);
                    localStorage.removeItem("cart");
                    setCartItems([]);
                    setTotalValue(0);
                })
                .catch(err => {
                    console.error("Error creating order:", err);
                    alert("Payment was successful but failed to create order. Please contact support.");
                });

            },
            prefill: {
                name: "John Doe",
                email: "",
                contact: ""
            },
            notes: {
                address: "Razorpay Corporate Office"
            },
            theme: {
                color: "#F37254"
            }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    // Process Cash On Delivery (COD) orders
    const processCOD = async () => {
        if (totalValue <= 0) {
            alert("Cart is empty or total is zero.");
            return;
        }

        try {
            const res = await axios.post(`http://localhost:3000/api/orders/create`, {
                products: productsWithQuantity,
                totalAmount: totalValue,
                paymentMethod: "COD",
                razorpayPaymentId: null
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            console.log("COD Order created successfully:", res.data);
            localStorage.removeItem("cart");
            setCartItems([]);
            setTotalValue(0);
            alert("Order placed successfully (COD).");
        } catch (err) {
            console.error("Error creating COD order:", err);
            alert("Failed to create COD order. Please try again.");
        }
    };

    const handleOrderNow = async () => {
        if (paymentMethod === "Razorpay") {
            await processRazorpay();
        } else if (paymentMethod === "COD") {
            await processCOD();
        }
    };

    useEffect(() => {
        calculateTotalValue();
    }, [cartItems]);

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

            <p className="mt-5">Total Cart Value: ₹{totalValue}</p>
            <p>Choose Payment Method:</p>
            <div className="payment-methods" style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button
                    type="button"
                    className={paymentMethod === 'Razorpay' ? 'btn btn-primary' : 'btn btn-outline-primary'}
                    onClick={() => setPaymentMethod('Razorpay')}
                >
                    Razorpay Secure
                </button>

                <button
                    type="button"
                    className={paymentMethod === 'COD' ? 'btn btn-primary' : 'btn btn-outline-primary'}
                    onClick={() => setPaymentMethod('COD')}
                >
                    Cash on Delivery (COD)
                </button>
            </div>

            <button
                className="btn btn-success"
                onClick={handleOrderNow}
                disabled={cartItems.length === 0}
            >
                Order Now
            </button>
        </div>
    );
}

export default Cart;