const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//a document structre
var userSchema = new Schema({
    username:  {
        type: String,
        required: true,
        unique: true
    },
    password:  {
        type: String,
        required: true
    },
    admin:  {
        type: Boolean,
        default: false
    }
});


var User = mongoose.model('User', userSchema); //collection name = 'Dish'

module.exports = User;