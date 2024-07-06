const {Schema, model} = require('mongoose')

const MessageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
})

module.exports = model('Message', MessageSchema)

