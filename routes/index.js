var express = require('express');
var router = express.Router();

const {
    getProducts,
    postCart,
    deleteOrderItem,
    getOrderPage,
    changeCount,
    getProductPage,
    sendMessage,
    saveToOrder,
    clearCart,
    deleteCartItem
} = require('../controllers/IndexController')


/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(req.user?.cart?.items || [])
    res.render('index', {
        title: 'Main page', cart: req.user?.cart?.items || []
    });
});

router.get('/contact', function (req, res, next) {
    res.render('contact', {title: 'Contact', cart: req.user.cart.items});
});
router.get('/about', function (req, res, next) {
    res.render('about', {title: 'About', cart: req.user.cart.items});
});

router.get('/product_detail/:bookId', getProductPage)

router.get('/clear-cart', clearCart)

router.get('/order', getOrderPage)
router.get('/products', getProducts);
router.get('/list-products', getProducts);
router.get('/saveToOrder', saveToOrder)
router.post('/send-message', sendMessage)
router.post('/cart/:bookId', postCart)
router.post('/order-delete/:orderItemId', deleteOrderItem)
router.post('/cart-delete/:cartItemId', deleteCartItem)
router.post('/change-quantity/:cartItemId', changeCount)


module.exports = router;
