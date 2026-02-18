const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try{
        const { name, email, password, age, course } = req.body;

        const existingUser = await Student.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        console.log('Creating student with data:', { name, email, password, age, course });

        const student = new Student({
            name, 
            email,
            password,
            age,
            course
        });

        await student.save();

        console.log('Student created:', student);

        res.status(201).json({ message: 'User registered successfully', student });
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}

exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;

        const student = await Student.findOne({ email });
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
        res.status(500).json({ message: err.message });
    }
}