const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FavouriteSchema = new Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Dish'
    }]
},{
    timestamps: true,
    //to allow push
    usePushEach: true
});
var Favourites = mongoose.model('favourite', FavouriteSchema );
module.exports = Favourites;