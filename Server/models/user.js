var mog = require('mongoose');
var schema = mog.Schema;
var passportLocalMongoose = require('passport-local-mongoose');



var User = new schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    },
    facebookId: String
   
});


//('passport-local-mongoose') automatically adds "username", "password" and "salt" attribute to User schema
User.plugin(passportLocalMongoose);

module.exports = mog.model('User', User);