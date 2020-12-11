const mog = require('mongoose');
const schema = mog.Schema;


const feedbackSchema = new schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
    },
    telnum: {
        type: String,
        unique: true
    },
    email: {
        type: String,
    },
    agree: {
        type: Boolean,
        default: false
    },
    contactType: {
        type: String
    },
    message: {
        type: String,
        required: true
    }
}
    , {
        timestamps: true
    });

var Feedbacks = mog.model('Feedback', feedbackSchema);

module.exports = Feedbacks;