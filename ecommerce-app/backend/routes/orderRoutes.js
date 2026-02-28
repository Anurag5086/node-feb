const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createOrder, getOrderById, getAllOrders, updateOrderStatus } = require('../controllers/orderController');

router.post('/create',authMiddleware, createOrder);
router.get('/:id', authMiddleware, getOrderById);
router.get('/', authMiddleware, getAllOrders);
router.put('/:id', authMiddleware, updateOrderStatus);

module.exports = router;