var express = require('express');
var router = express.Router();

const {
    addItem,
    getItems,
    deleteItem,
    editPage,
    editBook,
    addItems,
    getMessagePage,
    getAddCategoryPage,
    postCategory,
    getCategoriesPage,
    deleteCategory,
    editCategory,
    getEditCategoryPage,
    deleteMessage
} = require('../controllers/Admin')


router.post('/add-item', addItem)
router.post('/delete-item/:bookId', deleteItem)
router.post('/edit-item/:bookId', editBook);
router.post('/add-category', postCategory)
router.post('/delete-category/:cat_id', deleteCategory)
router.post('/edit-category/:cat_id', editCategory)
router.post('/delete-message/:messageId', deleteMessage)

router.get('/add-items', addItems);
router.get('/edit-item/:bookId', editPage);
router.get('/books', getItems);
router.get('/messages', getMessagePage)
router.get('/add-category', getAddCategoryPage)
router.get('/categories', getCategoriesPage)
router.get('/edit-category/:cat_id', getEditCategoryPage)


module.exports = router;
