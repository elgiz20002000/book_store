const {Schema,model} = require('mongoose')
const User = require("./User");


const BookSchema = new Schema({
    photoLink:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    writerName:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categoryId:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
})

BookSchema.pre('deleteOne', async function () {
    const book = this
    const id = book._conditions._id
    try {
        const users = await User.find()
        for (let user of users) {
            user.cart.items = user.cart.items.filter(item => item.bookId.toString() !== id.toString())
            user.order.items = user.order.items.filter(item => item.bookId.toString() !== id.toString())
            await user.save()
        }
    }
    catch (e) {
        console.log(e)
    }
})

module.exports = model('Book',BookSchema)
