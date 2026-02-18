const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const app = express();
app.use(express.json());

// Create a new user
app.post('/user', (req, res) => {
    try{
        const {name, email, age} = req.body;

        if(!name || name.length <= 0 || !email || email.length <= 0){
            return res.status(400).json({error: 'Name and email are required'});
        }

        const user = new User({name, email, age});

        user.save()
            .then(savedUser => res.status(201).json(savedUser))
            .catch(err => res.status(400).json({error: err.message}));
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

// Get all users
app.get("/users", async (req, res) => {
    try{
        const users = await User.find();
        res.json(users);
    }catch(err){
        res.status(500).json({error: err.message});
    }

});

// Get a user by ID
app.get("/user/:id", async(req, res) => {
    try{
        const user = await User.findById(req.params.id)
        res.json(user);
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

// Update a user by ID
app.put("/user/:id", async (req, res) => {
    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedUser);
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

// Delete a user by ID
app.delete("/user/:id", async (req, res) => {
    try{
        await User.findByIdAndDelete(req.params.id);
        res.json({message: 'User deleted successfully'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

// Delete a user by email
app.delete("/user", async (req, res) => {
    try{
        if(req.query.email.length <= 0){
            return res.status(400).json({error: 'Email is required'});
        }
        await User.deleteOne({email: req.query.email});
        res.json({message: 'User deleted successfully'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Could not connect to MongoDB', err));

app.listen(3000, () => {
    console.log('Server is running on port 3000'); 
});