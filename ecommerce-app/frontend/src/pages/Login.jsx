import React from 'react';
import '../styles/Login.css';
import axios from 'axios';

const Login = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        axios.post(`http://localhost:3000/api/auth/login`, { email, password })
            .then(response => {
            console.log(response.data);
            alert("Login successful!");
            // Store token in localStorage or context for future authenticated requests
            localStorage.setItem("token", response.data.token);
            window.location.href = "/"; // Redirect to home page after successful login
            })
            .catch(error => {
            console.error("There was an error logging in!", error);
            alert("Login failed. Please check your credentials and try again.");
            });
    }   
    return (
        <div className="login-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={(e) => handleSubmit(e)}>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" placeholder="Enter your email" required id='email'/>
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" placeholder="Enter your password" required id='password'/>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;