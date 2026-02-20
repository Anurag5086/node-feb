const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  attachment: {
    type: String, // store the file path
    trim: true
  }
}, {
  timestamps: true // automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Task', taskSchema);