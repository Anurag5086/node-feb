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


            // Decode the token to get user data (like isAdmin) and store it in localStorage
            // JWT structure: header.payload.signature
            // We need to decode the payload to get user info
            // Note: In a real application, you should use a library like jwt-decode to handle this decoding and also handle token expiration, etc.
            // For simplicity, we're doing a basic base64 decode here
            // Split the token and decode the payload
            // Check if token is in the correct format before decoding
            // Ensure the token has three parts (header, payload, signature)
            // This is a very basic check and decode, in production use a proper JWT library
            const userData = response.data.token.split('.')[1];

            const decodedData = JSON.parse(atob(userData));
            localStorage.setItem("userData", JSON.stringify(decodedData));
            if(decodedData.isAdmin){
                localStorage.setItem("isAdmin", "true");
                window.location.href = "/admin"; // Redirect to home page after successful login
            } else {
                localStorage.removeItem("isAdmin");
                window.location.href = "/"; // Redirect to home page after successful login
            }
            
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