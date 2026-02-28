import React from "react";
import "../styles/Register.css";
import axios from "axios";

const Register = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const address = e.target.address.value;
        const password = e.target.password.value;
        const contactNumber = e.target.contact.value;

        axios.post(`http://localhost:3000/api/auth/register`, { name, email, address, password, contactNumber })
          .then(response => {
            console.log(response.data);
            alert("Registration successful!");
            window.location.href = "/login"; // Redirect to login page after successful registration
          })
          .catch(error => {
            console.error("There was an error registering!", error);
            alert("Registration failed. Please try again.");
          });
    }


  return (
    <div className="container mt-5 register-container">
      <h2 className="register-title">Register</h2>
      <form className="form-card" onSubmit={(e) => handleSubmit(e)}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input type="text" className="form-control" id="address" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" />
        </div>
        <div className="mb-3">
          <label htmlFor="contact" className="form-label">Contact Number</label>
          <input type="text" className="form-control" id="contact" />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}

export default Register;