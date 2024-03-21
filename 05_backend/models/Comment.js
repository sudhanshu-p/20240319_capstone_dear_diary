const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: Number,
        ref: 'User',
        required: true
    },
    parent_type: {
        type: String,
        enum: ['post', 'comment'],
        required: true
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    upvoted_by: [{
        type: Number,
        ref: 'User'
    }],
    downvoted_by: [{
        type: Number,
        ref: 'User'
    }]
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;