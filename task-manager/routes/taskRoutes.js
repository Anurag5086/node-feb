const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const taskController = require('../controllers/taskController');

router.post('/tasks', upload.single('attachment'), taskController.createTask);

module.exports = router;