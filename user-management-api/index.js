const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const errorHandler = require('./middleware/errorMiddleware');

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);

app.use(errorHandler);

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});