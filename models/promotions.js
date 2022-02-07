"name"
"image"
"label"
"price"
"description"

const mongoose = require('mongoose')
require(mongoose-currency).loadType(mongoose)
var Currency = mongoose.Types.Currency


const promotionSchema = mongoose.Schema({
    name : {
        type : String,
        default : 'default txt',
    },
    image: {type: String, required: false},
    label:{type:String, required: true},
    description: {type: String, required: true},
    price: {type: Currency, required: true, min: 1,}

})
var Promotions =  mongoose.model( 'Promotion' , promotionSchema)
module.exports = Promotions