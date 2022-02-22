const mongoose = require('mongoose')  
var passportLocalMomgoose = require('passport-local-mongoose')

const UserSchema = mongoose.Schema({
    firstname:{
        type: String,
        default: ''
    },
    lastname:{
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    }, 
    facebookId: String
})

UserSchema.plugin(passportLocalMomgoose);
var Users =  mongoose.model( 'User' , UserSchema)
module.exports = Users
