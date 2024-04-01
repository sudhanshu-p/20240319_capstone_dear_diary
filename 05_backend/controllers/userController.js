// External dependencies
require("dotenv").config();
const cron = require('node-cron');
// Models
const User = require("../models/User");
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
	const user = req.user;

	if (!user) {
		return res.status(404).send("Account does not exist");
	}

	try {
		const pages = await Page.find({ author: user._id });

		user.pages = pages;

		res.status(200).send(user);
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
	if (!userValidator.validateDescription(description)) {
		return res.status(416).send("Invalid description");
	}

	try {
		console.log(req.user)
		const user = await User.findOne({ _id: req.user.id });

		if (!user) {
			return res.status(404).send("Account does not exist");
		}

		user.description = description;
		await user.save();
		res.status(200).send("User details updated");
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
	const { username } = req.params;

	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).send("User not found");
		}
		// Get the user's pages
		const pages = await Page.find({ author: user._id });
		user.pages = pages;

		res.status(200).send(user);
	} catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
}

// Function to convert user-friendly schedule format to cron format
function convertScheduleToCron(schedule) {
    // Ensure schedule is a non-null string
    if (!schedule || typeof schedule !== 'string') {
        console.error('Error converting schedule to cron: Invalid or missing schedule');
        return null;
    }

    // Parse the user-friendly schedule (e.g., "10:00am")
    const match = /^(\d{1,2}):(\d{2})(am|pm)$/i.exec(schedule);
    if (!match) {
        console.error('Error converting schedule to cron: Invalid schedule format');
        return null;
    }

    const [, hour, minute, period] = match;
    let cronHour = parseInt(hour, 10);

    // Convert time to 24-hour format if needed
    if (period && period.toLowerCase() === 'pm' && cronHour !== 12) {
        cronHour += 12;
    } else if (period && period.toLowerCase() === 'am' && cronHour === 12) {
        cronHour = 0; // Midnight
    }

    // Construct the cron schedule format (minute hour * * *)
    const cronSchedule = `${parseInt(minute, 10)} ${cronHour} * * *`;
    return cronSchedule;
}


async function scheduleReminder(req, res) {
    try {
        // Extract data from the request body
        const { userId, schedule } = req.body;

        // Validate input data
        if (!userId || typeof userId !== 'string') {
            throw new Error('User ID is required and must be a string.');
        }
        if (!schedule || typeof schedule !== 'string') {
            throw new Error('Schedule is required and must be a string.');
        }

        // Convert user-friendly schedule to cron format
        const cronSchedule = convertScheduleToCron(schedule);
        if (cronSchedule === null) {
            // Handle the error or return as needed
            console.error('Error converting schedule to cron');
            return;
        }

        // Validate the cron pattern before passing it to node-cron
        if (!cron.validate(cronSchedule)) {
            console.error('Invalid cron pattern:', cronSchedule);
            return; // Return or handle the invalid pattern as needed
        }

        // Create a new cron task for the user's schedule
        const task = cron.schedule(cronSchedule, () => {
            console.log(`Reminder task for user ${userId} executed at ${new Date().toLocaleString()}`);
            // Add your reminder logic here (e.g., send an email notification)
        });

        console.log(`Scheduled reminder for user ${userId} with cron pattern: ${cronSchedule}`);
		res.status(200).send(`Scheduled reminder for user ${userId} with cron pattern: ${cronSchedule}`)
    } catch (error) {
        console.error('Error scheduling reminder:', error.message);
    }
}



// Exporting the functions
module.exports = {
	getUser,
	updateUser,
	getUserByUsername,
	scheduleReminder,
};
