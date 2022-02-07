const mongoose = require('mongoose')    
const leaderSchema = mongoose.Schema({
    name: {type: String, required: true,},
    description: {type: String, required: true},
    Image: {type: String },
    designation: {type: String, required: true},
    abbr: {type: String}
})
var Leaders =  mongoose.model( 'Leader' , leaderSchema)
module.exports= Leaders

