const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    try{
        const { name, email, password, age, course } = req.body;

        const existingUser = await Student.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const student = new Student({
            name, 
            email,
            password,
            age,
            course
        });

        await student.save();

        res.status(201).json({ message: 'User registered successfully', student });
    }catch(err){
        next(err)
    }
}

exports.login = async (req, res, next) => {
    try{
        const {email, password} = req.body;

        const student = await Student.findOne({ email }).select('+password');
        if(!student) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await student.comparePassword(password);
        if(!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            {
                id: student._id,
                role: student.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h'}
            )

        res.status(200).json({ message: 'Login successful', token });
    }catch(err){
        next(err)
    }
}