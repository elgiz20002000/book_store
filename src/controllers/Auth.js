const User = require('../models/User')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')

const MY_EMAIL = 'elgiz.elgiz.ismayilov@gmail.com'
const MY_PASSWORD = 'moqqxntexqwbtgxr'

var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: MY_EMAIL,
        pass: MY_PASSWORD
    }
}));


function generateRandomHash() {
    const randomData = crypto.randomBytes(32); // 32 bytes for SHA-256
    const hash = crypto.createHash('sha256').update(randomData).digest('hex');
    return hash;
}

exports.getLogin = (req, res, next) => {

    try {
        let message = req.flash('error')
        if (message.length) {
            message = message[0]
        } else {
            message = null
        }



        res.render('admin/login', {
            title: 'Login',
            errorMessage: message
        })
    } catch (er) {

    }

}


exports.getReset = (req, res) => {
    const {token} = req.params
    const {userId} = req.query


    let message = req.flash('error')
    if (message.length) {
        message = message[0]
    } else {
        message = null
    }

    res.render('admin/reset', {
        title: 'Reset password',
        errorMessage: message,
        token,
        userId
    })
}


exports.getForgot = (req, res) => {
    let message = req.flash('error')
    if (message.length) {
        message = message[0]
    } else {
        message = null
    }

    res.render('admin/forgot', {
        title: 'Forgot password',
        errorMessage: message
    })
}


exports.getSignUp = (req, res) => {
    let message = req.flash('error')
    if (message.length) {
        message = message[0]
    } else {
        message = null
    }

    res.render('admin/signup', {
        title: 'SignUp',
        errorMessage: message
    })
}

exports.postSignup = (req, res) => {
    const {name, email, password} = req.body
    User.findOne({email: email})
        .then(async user => {
            if (user) {
                req.flash('error', 'User already exist')
                return res.redirect('/auth/signup')
            }
            const hashedPassword = await bcrypt.hash(password, 12)
            const newUser = new User({name, email, password: hashedPassword, cart: {items: []}, order: {items: []}})

            return newUser.save()
        })
        .then(() => (res.redirect('/auth/login')))
        .catch((er) => console.log(er))

}


exports.postLogin = (req, res) => {
    const {email, password} = req.body
    User.findOne({email: email})
        .then(async user => {
            if (!user) {
                req.flash('error', 'User does not exist')
                return res.redirect('/auth/login')
            }
            const isValid = await bcrypt.compare(password, user.password)
            if (!isValid) {
                req.flash('error', 'Password is not valid')
                return res.redirect('/auth/login')
            }
            req.session.isAuthenticated = true
            req.session.user = user

            return req.session.save()
        })
        .then(() => (res.redirect('/admin/books')))
        .catch((er) => console.log(er))
}


exports.postForgot = (req, res) => {
    const {email} = req.body
    let generatedToken
    User.findOne({email})
        .then(async user => {
            if (!user) {
                req.flash('error', 'User isn`t exist')
                return res.redirect('/auth/forgot')
            }
            generatedToken = generateRandomHash()
            console.log(generatedToken)
            user.token = generatedToken
            user.tokenExpiration = Date.now() + 10 * 60 * 1000
            return user.save()
        })
        .then((user) => {
            transporter.sendMail({
                from: MY_EMAIL,
                to: email,
                subject: "Password reset",
                html: `<a href='http://localhost:3000/auth/reset/${generatedToken}?userId=${user._id}'>Click to reset your password</a>`
            })
            return res.redirect('/auth/login')
        })
}


exports.postReset = (req, res) => {
    const {password, confirm_password, userId} = req.body
    const {token} = req.params

    console.log(userId)
    if (password === confirm_password) {
        User.findOne({_id: userId, token: token, tokenExpiration: {$gt: Date.now()}})
            .then(user => {
                if (!user) {
                    req.flash('error', 'User is not exist or token time is expired')
                    return res.redirect('/auth/forgot')
                }
                bcrypt.hash(password, 12)
                    .then(hashedPassword => {
                        user.password = hashedPassword
                        user.token = undefined
                        user.tokenExpiration = undefined
                        return user.save()
                    })
                    .then(() => res.redirect('/auth/login'))
            })
            .catch(er => {
                req.flash('error', er.message)
                return res.redirect('/auth/forgot')
            })
    } else {
        req.flash('error', 'Password isn`t equal')
    }
}


exports.Logout = (req, res) => {
    req.session.destroy(er => {
        if (er) {
            console.log(er)
        }
        res.redirect('/')
    })
}
