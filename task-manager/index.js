const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api', taskRoutes);

mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Could not connect to MongoDB', err));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});