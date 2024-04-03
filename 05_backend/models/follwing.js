const mongoose = require('mongoose');
const { User } = require('./User');
const Schema = mongoose.Schema;

const followSchema = new Schema({
    follower: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    following: {
        type: Schema.Types.ObjectId,
        ref: User
    }
}, { timestamps: true })

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;
