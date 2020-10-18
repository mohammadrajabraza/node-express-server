const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const favoriteNoSchema = new Schema({
//     rating: {
//         type: Number,
//         min: 1,
//         max: 5,
//         required: true
//     },
//     comment: {
//         type: String,
//         required: true
//     },
//     author: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     }
// },
// {   
//     timestamps: true
// });

const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]
}, {
    timestamps: true
});

const Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;