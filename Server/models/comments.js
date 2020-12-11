const mog = require('mongoose');
const schema = mog.Schema;


const commentSchema = new schema({
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        //provide "reference" to user document

        type: mog.Schema.Types.ObjectId,
        ref: 'User'
    },
    dish: {
        type: mog.Schema.Types.ObjectId,
        ref: 'Dish'
    }
}, { timestamps: true });

var Comments = mog.model('Comment', commentSchema);

module.exports = Comments;