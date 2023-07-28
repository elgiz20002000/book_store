const {Schema, model} = require('mongoose')
const Book = require('./Book')
const User = require('./User')

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    }
})

CategorySchema.pre('deleteOne', async function (req, res) {
    const category = this;
    try {
        const id = category._conditions._id

        const users = await User.find().populate('cart.items.bookId').populate('order.items.bookId')
        for (let user of users) {
            user.cart.items = user.cart.items.filter(item => item.bookId.categoryId.toString() !== id.toString())
            user.order.items = user.order.items.filter(item => item.bookId.categoryId.toString() !== id.toString())
            await user.save()
        }

        // Delete books with the matching categoryId
        await Book.deleteMany({categoryId: id});


    } catch (err) {
        console.error(err);
        throw err;
    }
});

module.exports = model('Category', CategorySchema)