const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const taskRoutes = require('./routes/taskRoutes');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(helmet());
app.use(cors(
  {
    origin: 'http://localhost:3000', // allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // allowed HTTP methods
  }
));
app.use(limiter)
app.use(mongoSanitize());
app.use(xssClean());
app.use(cookieParser());
app.use(csurf({ cookie: true }));
app.use('/uploads', express.static('uploads'));
app.use('/api', taskRoutes);

mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Could not connect to MongoDB', err));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});