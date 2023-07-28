const Book = require("../models/Book");
const Category = require("../models/Category");
const Message = require("../models/Message");

exports.addItems = (req, res) => {
    Category.find()
        .then(categories => {
            res.render("admin/add-items", {
                title: "Items",
                path: "/add-items",
                edit: false,
                categories
            });
        })
        .catch(er => console.log(er))
};

exports.addItem = (req, res) => {
    const {name, price, writerName, photoLink, category} = req.body;
    const book = new Book({name, price, writerName, photoLink, categoryId:category, userId: req.user})
    book.save()
        .then(() => res.redirect("/admin/books"))
        .catch((error) => console.log(error));

};

exports.getItems = (req, res) => {
    Book.find().populate('categoryId')
        .then(books => {
            res.render("admin/books", {
                title: "Books page",
                path: "/books",
                books
            });
        })
        .catch(er => console.log(er))

};

exports.deleteItem = (req, res) => {
    const {bookId} = req.params;
    Book.deleteOne({_id: bookId})
        .then(() => {
            res.redirect("/admin/books");
        })
        .catch((err) => console.log(err));
};

exports.editPage = (req, res) => {
    const {bookId} = req.params;
    Category.find()
        .then(categories => {
            Book.findOne({_id: bookId})
                .then((book) => {
                    res.render("admin/add-items", {
                        edit: true,
                        path: "",
                        book,
                        title: "Edit page",
                        categories
                    });
                })
                .catch((er) => console.log(er));
        })
};

exports.editBook = (req, res) => {
    const {bookId} = req.params;
    const {name, price, writerName, photoLink, category} = req.body;
    const product = {
        name,
        price,
        writerName,
        photoLink,
        categoryId:category
    };
    Book.updateOne({_id: bookId}, {$set: {...product}})
        .then(() => {
            res.redirect("/admin/books");
        })
        .catch((er) => console.log(er));
};

exports.getMessagePage = (req, res) => {
    Message.find()
        .then(messages => {
            res.render('admin/messages', {
                title: "Message page",
                path: '/messages',
                messages
            })
        })
        .catch((er) => console.log(er))
}


exports.getAddCategoryPage = (req, res) => {
    Category.find()
        .then(categories => {
            res.render('admin/add-category', {
                edit: false,
                title: "Category page",
                path: '/add-category',
                categories
            })
        })
        .catch(er => console.log(er))
}


exports.postCategory = (req, res) => {
    const {name} = req.body
    Category.create({name})
        .then(() => {
            res.redirect('/admin/add-category')
        })
        .catch(er => console.log(er))
}

exports.getCategoriesPage = (req, res) => {
    Category.find()
        .then((categories) => {
            res.render('' +
                'admin/categories', {
                title: "Categories page",
                path: '/categories',
                categories
            })
        })
        .catch(er => console.log(er))
}

exports.deleteCategory = (req, res) => {
    const {cat_id} = req.params
    Category.deleteOne({_id: cat_id})
        .then(() => {
            res.redirect('/admin/categories')
        })
        .catch(er => console.log(er))
}

exports.editCategory = (req, res) => {
    const {cat_id} = req.params
    const {name} = req.body
    Category.updateOne({_id: cat_id}, {name})
        .then(() => {
            res.redirect('/admin/categories')
        })
        .catch(er => console.log(er))
}

exports.getEditCategoryPage = (req, res) => {
    const {cat_id} = req.params
    Category.findById(cat_id)
        .then(category => {
            res.render('admin/add-category', {
                edit: true,
                title: "Category page",
                path: '/edit-category',
                category
            })
        })
}


exports.deleteMessage = (req, res) => {
    const {messageId} = req.params
    Message.deleteOne({_id: messageId})
        .then(() => {
            res.redirect('/admin/messages')
        })
        .catch(er => console.log(er))
}
