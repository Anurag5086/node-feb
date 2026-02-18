const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getAllStudents, getStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const router = express.Router();

router.get('/', authMiddleware, getAllStudents);
router.get('/:id', authMiddleware, getStudent);
router.put('/:id', authMiddleware, updateStudent);
router.delete('/:id', authMiddleware, deleteStudent);

module.exports = router;