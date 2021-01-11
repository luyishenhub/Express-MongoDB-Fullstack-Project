const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose'); 
//so no need of manually setting username and password in schema anymore

//a document structre
var User = new Schema({
    firstname: {
      type: String,
        default: ''
    },
    lastname: {
      type: String,
        default: ''
    },
    facebookId: String,
    admin:   {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);


var User = mongoose.model('User', User); //collection name = 'Dish'

module.exports = User;