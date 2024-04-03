const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    // Username of the user, must be provided and of type string
    username: { type: String, required: true },

    // Description of the user, optional and of type string
    description: { type: String },

    // Email of the user, must be provided and of type string
    email: { type: String, required: true },

    // Password of the user, must be provided and of type string
    password: { type: String, required: true },
    reminderSettings: { type: Schema.Types.ObjectId, ref: 'Reminder' }
    userImage:{type:String,required:false},
    fmcToken:{type:String,required:false},
});

// Defining the schema for the Habit collection
const HabitSchema = new mongoose.Schema({
    // Title of the habit, must be provided and of type string
    title: { type: String, required: true },

    // Frequency of the habit, an array of objects with fields for day and time
    frequency: [{
        // Day of the week when the habit is performed
        day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },

        // Time of the day when the habit is performed
        time: { type: String }
    }]
});
 
// Creating the model using the defined schema
const User = mongoose.model('User',userSchema);
const Habit=mongoose.model('habit',HabitSchema)
module.exports = User,Habit ;