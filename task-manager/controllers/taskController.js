const Task = require('../models/Task');

exports.createTask = async (req, res, next) => {
    try{
        const { title, description } = req.body;

        const newTask = new Task({
            title,
            description,
            attachment: req.file ? req.file.path : null
        })

        await newTask.save();

        res.status(201).json({ message: "Task created successfully", task: newTask });  

    }catch(err){
        res.status(500).json({ message: "Server error", error: err.message });
    }
}