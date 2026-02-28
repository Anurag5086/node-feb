import React from "react";
import { useState } from "react";
import "../styles/Home.css";
import axios from "axios";
import { useEffect } from "react";

const Home = () => {
    const [categories, setCategories] = useState([]);

    const fetchCategories = () => {
        axios.get(`http://localhost:3000/api/categories/list`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
        })
            .then(response => {
                setCategories(response.data.categories);
            })
            .catch(error => {
                console.error("There was an error fetching categories!", error);
            });
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="home-container">
            {/* <h1>Acciozon</h1> */}
            <h2>Choose from any categories below!</h2>
            <br/>
            <div className="categories-list">
                {categories?.map(category => (
                    <div key={category._id} className="category-card" onClick={() => window.location.href = `/products?category=${category.title}&categoryId=${category._id}`}>
                        <h3>{category.title}</h3>
                        <p>{category.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;