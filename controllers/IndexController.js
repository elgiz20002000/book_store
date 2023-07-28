const Category = require('../models/Category')
const Book = require('../models/Book')
const Message = require('../models/Message')



exports.getProducts = async (req, res) => {
    try {
        const defaultPage = req.query.page || 1;
        const itemsPerPage = 5 ; // Number of books to display per page

        const totalBooks = await Book.countDocuments();
        const skip = (defaultPage - 1) * itemsPerPage;

        const { category, minValue, maxValue, search } = req.query;

        const whereCondition = {};

        if (category && +category !== 1) {
            whereCondition.categoryId = category;
        }

        if (minValue && maxValue) {
            whereCondition.price = {
                $gte: minValue,
                $lte: maxValue,
            };
        }

        if (search) {
            whereCondition.name = {
                $regex: new RegExp(search, 'i'),
            };
        }

        const categories = await Category.find();

        const books = await Book.find(whereCondition)
            .populate('categoryId')
            .skip(skip)
            .limit(itemsPerPage);

        if (req.path === '/list-products') {
            res.render('list-products', {
                title: 'List Products',
                path: req.path,
                books,
                categories,
                cart: req.user.cart.items,
                page: defaultPage,
                limit:Math.floor(Math.ceil(totalBooks / 5))
            });
        } else {
            res.render('products', {
                title: 'Products',
                path: req.path,
                books,
                categories,
                cart: req.user.cart.items,
                page: defaultPage,
                limit:Math.floor(Math.ceil(totalBooks / 5))
            });
        }
    } catch (error) {
        console.log(error);
    }
};


exports.postCart = async (req, res, next) => {
    const {bookId} = req.params
    let quantity = 1
    const cart = req.user.cart
    const items = [...cart.items]
    const index = items.findIndex(item => +item.bookId.equals(bookId))
    try {
        if (index >= 0 && Object.keys(items[index]).length > 0) {
            ++items[index].quantity
        } else {
            const book = await Book.findById(bookId)
            items.push({bookId: book.id, quantity})
        }
        req.user.cart.items = items
        req.user.save()
            .then(() => {
                res.redirect('/')
            })
            .catch(er => console.log(er))
    } catch (er) {
        console.log(er)
        next()
    }
}

exports.deleteOrderItem = (req, res) => {
    const { orderItemId } = req.params;

    // Filter out the item with matching bookId from the order items array
    req.user.order.items = [...req.user.order.items.filter(item => !item.bookId.equals(orderItemId))]

    // Save the updated user object
    req.user
        .save()
        .then(() => {
            res.redirect('/order');
        })
        .catch((err) => {
            console.error(err);
        });
}

exports.deleteCartItem = (req, res) => {
    const { cartItemId } = req.params;

    // Filter out the item with matching bookId from the order items array
    req.user.cart.items = [...req.user.cart.items.filter(item => !item.bookId.equals(cartItemId))]
    req.user
        .save()
        .then(() => {
            res.redirect('/');
        })
        .catch((err) => {
            console.error(err);
        });
}

exports.saveToOrder = (req, res) => {
    const user = req.user
    user.order = {...user.cart}
    user.cart = {items:[]}
    user.save()
        .then(() => {
            res.redirect('/order')
        })
        .catch(er => console.log(er))
}

exports.getOrderPage = async (req, res) => {
    try {
        const order = req.user?.order
        const orderItems = order ? (await req.user.order.populate('items.bookId'))?.items : []
        const cart = req.user?.cart?.items || []
        res.render('order', {title: 'Order page', order: orderItems || [], cart});
    }
    catch (er) {
        console.log(er)
        throw er

    }

}


exports.changeCount = (req, res) => {
    const { cartItemId } = req.params;
    const { change_count } = req.query;

    // Update the quantity using Mongoose's updateOne method
    const orderItems = [...req.user.order.items]
    orderItems.find(item => item._id.toString() === cartItemId).quantity += +change_count
    req.user.order.items = orderItems
        req.user.save()
        .then(() => {
            res.redirect('/order');
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while updating the cart item quantity.' });
        });
};

exports.getProductPage = (req, res) => {
    const {bookId} = req.params
    Book.findById(bookId)
        .then(book => {
            res.render('product_detail', {title: 'Product page', book, cart: req.user.cart.items});
        })
        .catch(er => console.log(er))
}

exports.sendMessage = (req, res) => {
    const {email, phoneNumber, message, name, companyName} = req.body
    Message.create({email, phoneNumber, message, name, companyName})
        .then(() => {
            res.redirect('/')
        })
        .catch((er) => {
            console.log(er)
        })
}


exports.clearCart = (req, res) => {
    req.user.order.items = []
    req.user.save()
        .then(() => {
            res.redirect('/order')
        })
        .catch(er => console.log(er))
}
