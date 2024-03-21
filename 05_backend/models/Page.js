const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSchema = new Schema({
    title: { type: String, required: true, maxLength: 256, unique: true },
    content: { type: String, required: true },
    author_name: { type: String, ref: 'User', required: true },
    published: { type: Boolean, default: false },
    publish_time: { type: Date },
    last_updated_time: { type: Date, default: Date.now },
    upvoted_by: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    downvoted_by: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    visibility: { type: String, enum: ['private', 'public'], default: 'private' }
});

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;