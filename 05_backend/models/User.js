const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    description: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    reminderSettings: { type: mongoose.Schema.Types.ObjectId, ref: 'Reminder' },
    userImage: { type: String, required: false },
    fmcToken: { type: String, required: false },
    // Array of habits to be tracked
    habits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Habit' }],
});

// Schema for the habit object
const habitSchema = new mongoose.Schema({
    title: { type: String, required: true },
    // Array of booleans to represent the days of the week
    frequency: { type: [Boolean] },
    // Time of day to be reminded
    time: { type: String },
});

// Creating the model using the defined schema
const User = mongoose.model('User', userSchema);
const Habit = mongoose.model('Habit', habitSchema);
module.exports = { User, Habit };