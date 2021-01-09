const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose'); 
//so no need of manually setting username and password in schema anymore

//a document structre
var userSchema = new Schema({
    admin:  {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose);


var User = mongoose.model('User', userSchema); //collection name = 'Dish'

module.exports = User;