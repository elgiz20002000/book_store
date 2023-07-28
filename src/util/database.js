const {Sequelize} = require('sequelize')


const sequelize = new Sequelize('books_db', 'root', 'az6861147', {
    host: 'localhost',
    dialect: 'mysql',

});


module.exports = sequelize
