const mongoose = require('mongoose')  
var passportLocalMomgoose = require('passport-local-mongoose')

const UserSchema = mongoose.Schema({
    admin: {
        type: Boolean,
        default: false
    }
})

UserSchema.plugin(passportLocalMomgoose);
var Users =  mongoose.model( 'User' , UserSchema)
module.exports = Users
