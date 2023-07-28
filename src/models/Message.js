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


// const sequelize = require('../util/database')
// const Sequelize = require('sequelize')
//
//
// const Message = sequelize.define('message', {
//     id:{
//         type:Sequelize.INTEGER,
//         allowNull: false,
//         autoIncrement:true,
//         primaryKey:true
//     },
//     name:{
//         type:Sequelize.STRING,
//         allowNull: false,
//     },
//     companyName:{
//         type:Sequelize.STRING,
//         allowNull: false,
//     },
//     email:{
//         type:Sequelize.STRING,
//         allowNull: false,
//     },
//     phoneNumber:{
//         type:Sequelize.STRING,
//         allowNull: false,
//     },
//     message:{
//         type:Sequelize.TEXT,
//         allowNull: false,
//     },
//
// })
//
//
// module.exports = Message