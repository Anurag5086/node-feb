const errorHandler = (err, req, res, next) => {
    if(err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({  
            success: false, 
            errors: messages.join(', ') 
        });
    }

    res.status(500).json({
        success: false,
        message: err.message || "Server Error"
    });
}

module.exports = errorHandler;