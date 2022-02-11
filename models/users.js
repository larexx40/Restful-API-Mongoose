const mongoose = require('mongoose')    
const UserSchema = mongoose.Schema({
    username : {
        type : String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
})
var Users =  mongoose.model( 'User' , UserSchema)
module.exports = Users
