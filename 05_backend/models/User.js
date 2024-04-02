const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    description: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    userImage:{type:String,required:false},
    fmcToken:{type:String,required:false},

});

const User = mongoose.model('User', userSchema);

module.exports = User;