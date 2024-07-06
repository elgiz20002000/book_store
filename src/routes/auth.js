var express = require('express');
var router = express.Router();

const AuthController = require('../controllers/Auth')


router.get('/login', AuthController.getLogin);
router.get('/signup', AuthController.getSignUp);

router.get('/reset/:token', AuthController.getReset);
router.get('/forgot', AuthController.getForgot);

router.post('/reset/:token', AuthController.postReset);
router.post('/forgot', AuthController.postForgot);

router.post('/signup', AuthController.postSignup)

router.post('/login', AuthController.postLogin)

router.post('/logout', AuthController.Logout)




module.exports = router;
