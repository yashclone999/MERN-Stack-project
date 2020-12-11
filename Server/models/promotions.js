const mog = require('mongoose');
require('mongoose-currency').loadType(mog);
const schema = mog.Schema;
const Currency = mog.Types.Currency;

const promSchema = new schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
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
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }

}); 

var Proms = mog.model('prom', promSchema);
module.exports = Proms;

