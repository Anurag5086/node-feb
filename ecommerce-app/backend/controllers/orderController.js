const Order = require('../models/Order');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        let { products, totalAmount, paymentMethod, razorpayPaymentId } = req.body;

        if(paymentMethod !== 'Razorpay' && paymentMethod === 'COD'){
            razorpayPaymentId = null; // Clear Razorpay payment ID for COD orders
        }

        const order = new Order({
            userId: req.user.id,
            products,
            totalAmount,
            paymentMethod,
            razorpayPaymentId
        });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('products.productId');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all orders for the logged-in user
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).populate('products.productId');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllOrdersForAdmin = async (req, res) => {
    try {
        if(!req.user.isAdmin){
            return res.status(403).json({ message: 'Only admins can access all orders' });
        }
        const orders = await Order.find().populate('products.productId');
        res.json(orders);
    } catch (error) {o
        res.status(500).json({ message: 'Server error' });
    }
};