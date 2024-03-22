const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    author_name: {
        type: String,
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
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvoted_by: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;