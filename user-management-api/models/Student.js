const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    age:{
        type: Number,
    },
    course: {
        type: String,
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
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

