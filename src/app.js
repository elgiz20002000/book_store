var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require('mongoose')
var indexRouter = require("./routes/index");
let adminRouter = require("./routes/admin");
const authRouter = require('./routes/auth')
var app = express();
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash')
const csrf = require('csurf')


const store = new MongoDBStore({
    uri: 'mongodb+srv://Elgiz:U4z4YKD7DTEUtxBT@cluster1.db3ynra.mongodb.net/Book',
    collection: 'bookSessions'
});

store.on('error', function (error) {
    console.log(error);
});

const User = require("./models/User");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({
    secret: 'secret code',
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(flash())

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(csrf())

app.use((req, res, next) => {
    User.findById(req.session.user?._id).populate('cart.items.bookId')
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((er) => console.log(er));
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated
    res.locals.csrfToken = req.csrfToken()
    next()
})


app.use("/", indexRouter);
app.use('/admin', adminRouter)
app.use('/auth',authRouter)


// catch 404 and forward to error handler
app.use("*", (req, res) => {
    res.render('404', {title: '404', cart: req.user?.cart?.items || []});
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

app.use((error, req, res, next) => {
    res.render('404', {title: error.title, cart: req.user?.cart?.items || []});
})

mongoose.connect('mongodb+srv://Elgiz:U4z4YKD7DTEUtxBT@cluster1.db3ynra.mongodb.net/Book')
    .then(() => {
        app.listen(3000, (er) => {
            if (er) console.log(er)
        })
    })
    .catch(er => console.log(er))

