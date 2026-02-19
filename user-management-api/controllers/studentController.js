const Student = require('../models/Student');

// Admin only - get all students
exports.getAllStudents = async (req,res, next) => {
    try{
        if(req.user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden! You don't have permission to access this resource." });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skipValue = (page - 1) * limit;

        const students = await Student.find({role: "student"}).sort({age: 1}).skip(skipValue).limit(limit);

        const result = await Student.aggregate([
            {
                $group: {
                    _id: "$course",
                    sumOfAge: {
                        $sum: "$age"
                    }
                }
            }
        ])
        
        res.status(200).json({
            students,
            averageAgeByCourse: result
        });
    }catch(err){
        next(err)
    }
}

exports.getStudent = async (req, res, next) => {
    try{
        const student = await Student.findById(req.params.id)
        
        if(!student) {
            return res.status(404).json({ message: "Student not found!" });
        }

        res.status(200).json(student);
    }catch(err){
        next(err)
    }
}

exports.updateStudent = async (req, res, next) => {
    try{
        const studentId = req.params.id;
        const { name, email, age, course } = req.body;

        const student = await Student.findByIdAndUpdate(
            studentId,
            { name, email, age, course },
            { new: true, runValidators: true }
        );

        res.status(200).json(student);
    }catch(err){
        next(err)
    }
}

// Admin only - delete a student
exports.deleteStudent = async (req, res, next) => {
    try {
        if(req.user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden! You don't have permission to access this resource." });
        }

        const studentId = req.params.id;
        await Student.findByIdAndDelete(studentId);
        res.status(200).json({ message: "Student deleted successfully!" });
    }catch(err){
        next(err)
    }
}