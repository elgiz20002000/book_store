
const {Schema, model} = require('mongoose')
const {Sequelize} = require("sequelize");

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    cart:{
        items:[{
            bookId:{type:Schema.Types.ObjectId, ref:'Book', required: true},
            quantity:{type:Number, required: false}
        }]
    },
    order:{
        items:[{
            bookId:{type:Schema.Types.ObjectId, ref:'Book', required: true},
            quantity:{type:Number, required: false}
        }]
    }

})


module.exports = model('User', UserSchema)



