const Cart = require('../models/Cart')
const fetchCartData = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ where: { userId: req.user.id } });
        req.cart = cart; // Attach the cart object to the request object
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
};


module.exports = fetchCartData