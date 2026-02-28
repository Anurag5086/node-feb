const AddToCartToLocalStorage = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item._id === product._id);
    
    if (existingProductIndex !== -1) {
        // If product exists, increment quantity
        cart[existingProductIndex].quantity += 1;
    } else {
        // If product doesn't exist, add to cart with quantity 1
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
};

const getCartFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("cart")) || [];
};

const removeFromCartInLocalStorage = (productId) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item._id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
};

export { AddToCartToLocalStorage, getCartFromLocalStorage, removeFromCartInLocalStorage };