//Schema for document that are stored in collections

const mog = require('mongoose');
require('mongoose-currency').loadType(mog);
const schema = mog.Schema;
const Currency = mog.Types.Currency;




//We have defined structure of the document that we will put into database. 
//Structure of document is as defined as below
const dishSchema = new schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required:true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
        timestamps: true
    });

var Dishes = mog.model('Dish', dishSchema);

module.exports = Dishes;