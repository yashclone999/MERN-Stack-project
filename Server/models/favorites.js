const mog = require('mongoose');
const schema = mog.Schema;

const dishSchema = new schema({
    _id: {
        type: schema.Types.ObjectId,
        ref: 'Dish'
    }
});

const favoriteSchema = new schema({
    user: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    dishes:[dishSchema]

});

// _Record_._subRecord_.id()  : method to operate on array element,
// _Record_._subRecord_[]._id : method to get element id

const Favorites = mog.model('Favorite', favoriteSchema);
module.exports = Favorites;