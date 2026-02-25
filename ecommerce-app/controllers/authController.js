const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    try{
        const {name, email, password, contactNumber, address, isAdmin} = req.body;

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const user = new User({
            name, 
            email,
            password,
            address,
            contactNumber,
            isAdmin
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully', user });
    }catch(err){
        next(err)
    }
}

exports.login = async (req, res, next) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h'}
            )

        res.status(200).json({ message: 'Login successful', token });
    }catch(err){
        next(err)
    }
}