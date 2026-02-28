// ...existing code...
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Products.css";
import { AddToCartToLocalStorage } from "../utils/cartUtils";
// ...existing code...

const Products = () => {
    const [products, setProducts] = useState([]);

    // helper to render star spans
    const getStars = (rating = 0) => {
        const full = Math.round(Math.max(0, Math.min(5, rating)));
        return Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`star ${i < full ? "filled" : ""}`}>★</span>
        ));
    };

    // Fetch products based on category from query params
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const categoryId = params.get("categoryId");
        if (categoryId) {
            axios.get(`http://localhost:3000/api/products/list?categoryId=${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then(response => {
                setProducts(response.data.products || []);
            })
            .catch(error => {
                console.error("There was an error fetching products!", error);
            });
        }
    }, []);

    return (
        <div className="products-container">
            <h1>Products</h1>
            <div className="products-list">
                {products?.map(product => (
                    <div key={product._id} className="product-card">
                        <div className="product-image">
                            <img src={product.images?.[0] || "/placeholder.png"} alt={product.title} />
                        </div>

                        <div className="product-body">
                            <h3 className="product-title">{product.title}</h3>

                            <div className="product-meta">
                                <div className="rating">
                                    {getStars(product.rating)}
                                    <span className="rating-value">{product.rating ? product.rating.toFixed(1) : "0.0"}</span>
                                </div>
                                <div className="reviews">({product.numOfReviews || 0})</div>
                            </div>

                            <p className="product-desc">{product.description}</p>

                            <div className="product-footer">
                                <div className="price">
                                    <span className="mrp">₹{product.mrpPrice}</span>
                                    <span className="discounted">₹{product.discountedPrice}</span>
                                </div>
                                <button className="btn btn-primary add-to-cart" onClick={() => AddToCartToLocalStorage(product)}>Add to Cart</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;
// ...existing code...