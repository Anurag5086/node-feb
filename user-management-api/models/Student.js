const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters long"],
        maxLength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm, "Please provide a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        validate: {
            validator: function (value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
            },
            message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
        },
        select: false
    },
    age:{
        type: Number,
        min: [18, "Student must be at least 18 years old"],
        max: [100, "Student age cannot exceed 100 years"]
    },
    course: {
        type: String,
        required: [true, "Course is required"],
        trim: true,
        minlength: [2, "Course name must be at least 2 characters long"],
        maxLength: [100, "Course name cannot exceed 100 characters"]
    },
    role: {
        type: String,
        enum: {
            values: ['student', 'admin'],
            message: "Role must be either 'student' or 'admin'"
        },
        default: 'student'
    }
}, { timestamps: true });

// Hash password before saving
studentSchema.pre('save', async function (next){
    if(!this.isModified('password')) {
        return next;
    }

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt)
    next;
})

// Compare password method
studentSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('Student', studentSchema);

