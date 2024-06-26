// External dependencies
require("dotenv").config();
const mongoose = require('mongoose');
const dateStreaks = require("date-streaks")
const cron = require('node-cron');
// Models
const { User, Habit } = require("../models/User");
const Page = require("../models/Page");
const Reminder = require("../models/Reminder")


// Validators
const userValidator = require("../validators/User");

/** Get user details
 * @async
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Returns the user details
 * @returns {Object} - Returns an error if the user does not exist
 */
async function getUser(req, res) {
    let user = req.user;

    try {
        const pages = await Page.find({ author_name: user._id });
        console.log(pages)
        user.pages = pages;
        const publish_dates = []
        pages.forEach((page) => {
            publish_dates.push(page.publish_time)
        })
        streak_summary = dateStreaks.summary({ publish_dates })
        console.log(streak_summary)

        user = await User.aggregate([
            {
                $match: { _id: user._id }
            },
            // Lookup for user habits
            {
                $lookup: {
                    from: 'habits',
                    localField: 'habits',
                    foreignField: '_id',
                    as: 'habits'
                }
            },
            // Lookup for user followers
            {
                '$lookup': {
                    'from': 'follows',
                    'localField': '_id',
                    'foreignField': 'following',
                    'as': 'followerof'
                }
            }, {
                '$lookup': {
                    'from': 'follows',
                    'localField': '_id',
                    'foreignField': 'follower',
                    'as': 'followingto'
                }
            }, {
                '$addFields': {
                    'followersCount': {
                        '$size': '$followerof'
                    },
                    'followingCount': {
                        '$size': '$followingto'
                    }
                }
            },
        ])
        user = user[0]
        user.streak = {
            current: streak_summary.currentStreak,
            longest: streak_summary.longestStreak,
            total_blogs: pages.length
        }

        console.log(user)

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
}

/** Update user details
 * @async
 * @param {Object} req - Request object. Mandatory fields: description
 * @param {Object} res - Response object
 * @returns {Object} - Returns a message if the user details are successfully updated
 * @returns {Object} - Returns an error if the user details are not successfully updated
 */
async function updateUser(req, res) {
    const { description } = req.body;
    console.log(req.body)

    // Validate the user input
    // if (!userValidator.validateDescription(description)) {
    // 	return res.status(416).send("Invalid description");
    // }

    try {
        console.log(req.user)
        const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true })

        if (!user) {
            return res.status(404).send("Account does not exist");
        }

        user.description = description;
        await user.save();
        res.status(200).json({ message: "User details updated" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
}

/** Get user details by username
 * @async
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Returns the user details
 * @returns {Object} - Returns an error if the user does not exist
 */
async function getUserByUsername(req, res) {
    // console.log(req.params)
    const username = req.params.username;
    console.log(username);
    let user

    try {
        let userId
        if (req.user) {
            userId = req.user.id
        }

        user = await User.findOne({ username });
        console.log(user);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const profileData = await User.aggregate([
            {
                '$match': {
                    'username': username
                }
            }, {
                '$lookup': {
                    'from': 'follows',
                    'localField': '_id',
                    'foreignField': 'following',
                    'as': 'followerof'
                }
            }, {
                '$lookup': {
                    'from': 'follows',
                    'localField': '_id',
                    'foreignField': 'follower',
                    'as': 'followingto'
                }
            }, {
                '$addFields': {
                    'followersCount': {
                        '$size': '$followerof'
                    },
                    'followingCount': {
                        '$size': '$followingto'
                    },
                    'isfollowing': {
                        '$cond': {
                            'if': {
                                '$in': [
                                    new mongoose.Types.ObjectId(userId), '$followerof.follower'
                                ]
                            },
                            'then': true,
                            'else': false
                        }
                    }
                }
            },
        ])
        // Get the user's pages
        const pages = await Page.find({ author_name: user._id });
        // user.pages = pages;
        // user.profileData = profileData;
        // console.log(pages)
        const publish_dates = []
        pages.forEach((page) => {
            publish_dates.push(page.publish_time)
        })
        streak_summary = dateStreaks.summary({ publish_dates })

        const streak = {
            current: streak_summary.currentStreak,
            longest: streak_summary.longestStreak,
            total_blogs: pages.length
        };

        console.log(streak)

        res.status(200).json({ "user": user, "pages": pages, "followData": profileData[0], "streak": streak });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
}

// Define an asynchronous function to handle creating a new habit
async function createHabit(req, res) {
    const { title, frequency, time } = req.body;
    const user = req.user
    try {
        // Create a new habit using the Habit model and provided data
        const habit = await Habit.create({ title, frequency, time });

        // Add the created habit to the user's list of habits
        user.habits.push(habit._id);
        await user.save();

        return res.status(201).json({ habit });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Get the habits of a user
async function getHabits(req, res) {
    try {
        // Find the user by ID and populate the habits
        const user = await User.aggregate([
            {
                $match: { _id: user.id }
            },
            // Lookup for user habits
            {
                $lookup: {
                    from: 'habits',
                    localField: 'habits',
                    foreignField: '_id',
                    as: 'habits'
                }
            }
        ])

        return res.status(200).json({ habits: user[0].habits });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message });
    }
}

async function updateHabit(req, res) {
    const user = req.user;
    const { id } = req.params;
    const { title, frequency, time } = req.body;

    try {
        // Find the habit by ID
        const habit = await Habit.findOne({ _id: id });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Check if the habit belongs to the current user
        if (!user.habits.includes(id)) {
            return res.status(403).json({ message: 'You are not authorized to update this habit' });
        }

        // Update the habit with the provided data 
        habit.title = title;
        habit.frequency = frequency;
        habit.time = time;
        await habit.save();

        return res.status(200).json({ habit });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

async function deleteHabit(req, res) {
    const user = req.user;
    const { id } = req.body;

    try {
        // Find the habit by ID
        const habit = await Habit.findOne({ _id: id });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Check if the habit belongs to the current user
        if (!user.habits.includes(id)) {
            return res.status(403).json({ message: 'You are not authorized to delete this habit' });
        }

        // Remove the habit from the user's list of habits
        user.habits = user.habits.filter(habitId => habitId.toString() !== id);
        await user.save();

        // Delete the habit from the database
        await habit.remove();

        return res.status(200).json({ message: 'Habit deleted successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

// Function to convert user-friendly schedule format to cron format
function convertScheduleToCron(schedule) {
    // Ensure schedule is a non-null string
    if (!schedule || typeof schedule !== 'string') {
        console.error('Error converting schedule to cron: Invalid or missing schedule');
        return null;
    }

    // Parse the user-friendly schedule (e.g., "10:00am on Mon, Wed, Fri")
    const match = /^(\d{1,2}):(\d{2})(am|pm)\s+on\s+((?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)(?:,\s+(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat))*)$/i.exec(schedule);
    if (!match) {
        console.error('Error converting schedule to cron: Invalid schedule format');
        return null;
    }

    const [, hour, minute, period, daysOfWeek] = match;
    let cronHour = parseInt(hour, 10);

    // Convert time to 24-hour format if needed
    if (period && period.toLowerCase() === 'pm' && cronHour !== 12) {
        cronHour += 12;
    } else if (period && period.toLowerCase() === 'am' && cronHour === 12) {
        cronHour = 0; // Midnight
    }

    const cronDaysOfWeek = daysOfWeek.split(',').map(day => {
        // Map user-friendly day names to cron day numbers (0-6, 0=Sunday, 1=Monday, ..., 6=Saturday)
        const dayMapping = {
            'Sun': 0,
            'Mon': 1,
            'Tue': 2,
            'Wed': 3,
            'Thu': 4,
            'Fri': 5,
            'Sat': 6,
        };
        return dayMapping[day.trim()];
    });

    // Construct the cron schedule format with specific days of the week
    const cronSchedule = `${parseInt(minute, 10)} ${cronHour} * * ${cronDaysOfWeek.join(',')}`;

    return cronSchedule;
}

async function scheduleReminder(req, res) {
    try {
        // Extract data from the request body
        const remindersData = req.body.reminders;

        // Validate input data
        if (!remindersData || !Array.isArray(remindersData)) {
            throw new Error('Reminders data is required and must be an array.');
        }

        // Create an array to store the created reminders
        const createdReminders = [];

        // Iterate over each reminder data
        for (const reminderData of remindersData) {
            const { userId, schedule } = reminderData;

            // Convert user-friendly schedule to cron format
            const cronSchedule = convertScheduleToCron(schedule);
            if (cronSchedule === null) {
                console.error('Error converting schedule to cron for reminder:', reminderData);
                continue; // Skip this reminder and proceed to the next one
            }

            // Validate the cron pattern before passing it to node-cron
            if (!cron.validate(cronSchedule)) {
                console.error('Invalid cron pattern for reminder:', reminderData);
                continue; // Skip this reminder and proceed to the next one
            }

            // Create a new reminder object
            const reminder = new Reminder({
                userId: userId,
                schedule: schedule
            });

            // Save the reminder to MongoDB using Mongoose
            try {
                const savedReminder = await reminder.save();
                console.log('Reminder saved to MongoDB:', savedReminder);
                createdReminders.push(savedReminder);
            } catch (error) {
                console.error('Error saving reminder to MongoDB:', error.message);
            }
        }

        // Send the response with the created reminders
        res.status(200).send({ createdReminders });
    } catch (error) {
        console.error('Error scheduling reminders:', error)
        res.status(500).send({ error });
    }
}
// Exporting the functions
module.exports = {
    getUser,
    updateUser,
    getUserByUsername,
    createHabit,
    getHabits,
    updateHabit,
    deleteHabit,
    // scheduleReminder,
};
