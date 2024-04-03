// models/Reminder.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reminderSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    schedule: { type: String, required: true }
});

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;
