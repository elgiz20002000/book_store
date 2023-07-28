var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require('mongoose')
var indexRouter = require("./routes/index");
let adminRouter = require("./routes/admin");
var app = express();

const User = require("./models/User");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById('64ba2c12cf4f925c9c236ac5').populate('cart.items.bookId')
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((er) => console.log(er));
});


app.use("/", indexRouter);

app.use("/admin", adminRouter);


// catch 404 and forward to error handler
app.use("*", (req, res) => {
    res.render('404', {title: '404', cart:req.user.cart.items});
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

app.use(`/.netlify/functions/api`, router);


mongoose.connect('mongodb+srv://Elgiz:U4z4YKD7DTEUtxBT@cluster1.db3ynra.mongodb.net/Book')
    .then(async () => {
        User.findOne({_id:'64ba2c12cf4f925c9c236ac5'})
            .then(user => {
                if(!user) {
                    const user = new User({
                        name: 'elgiz', cart: {
                            items: []
                        }
                    })
                    user.save()
                        .then(() => {
                            app.listen(3000, (er) => {
                                if (er) console.log(er)
                            });
                        })
                } else  {
                    app.listen(3000, (er) => {
                        if (er) console.log(er)
                    });
                }
            })
                    .catch(er => console.log(er))

    })
    .catch(er => console.log(er))

