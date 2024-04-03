// External dependencies
require("dotenv").config();
const nodemailer = require("nodemailer");
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

// // Function to send a reminder
// async function sendReminder(userId, schedule) {
//     try{
//         // Create a Nodemailer transporter
//         const transporter = nodemailer.createTransport({
//             // Provide your SMTP server configuration here
//             // Example for Gmail:
//             service: 'Gmail',
//             host: "smtp.gmail.com",
//             post: 587,
//             secure: false,
//             auth: {
//                 user: "wadetiwarsd@rknec.edu",
//                 pass: "duju bjcy tcfd igha",
//             },
//         });

//         // Setup email data
//         const mailOptions = {
//             from: 'wadetiwarsd@rknec.edu',
//             to: 'siddhiwadetiwar@gmail.com',
//             subject: 'Reminder',
//             text: `This is a reminder for user ${userId} scheduled at ${schedule}`,
//         };

//         // Send email
//         const info = await transporter.sendMail(mailOptions);
//         console.log('Email sent:', info.response);
//     }catch (error) {
//         console.error('Error sending email:', error.message);
//     }
//     // Implement your logic to send reminders here
//     // This could be sending an email, notification, etc.
// }

// Function to send a reminder email to the specified recipient.
async function sendReminder(userId, schedule) {
    try {
        // Fetch the user's email address from the database based on userId
        const user = await User.findById(userId);

        if (!user) {
            console.error('User not found');
            return; // Exit if user not found
        }

        const recipientEmail = user.email; // Extract user's email address

        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            // SMTP server configuration
            // Example for Gmail:
            service: 'Gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "wadetiwarsd@rknec.edu", // Your email address
                pass: "duju bjcy tcfd igha", // Your email password or app-specific password
            },
        });

        // Setup email data
        const mailOptions = {
            from:  "wadetiwarsd@rknec.edu", // Sender email address
            to: recipientEmail, // Recipient email address fetched from the database
            subject: 'Reminder',
            text: `This is a reminder for user ${userId} scheduled at ${schedule}`,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error.message);
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


// Schedule reminders based on the provided data
async function scheduleReminder(req, res) {
    try {
        // Extract data from the request body
        const remindersData = req.body && req.body.reminders; // Check if req.body is defined

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

            // Schedule the reminder using cron
            cron.schedule(cronSchedule, async () => {
                // Call the function to send the reminder
                await sendReminder(userId, schedule);
            });

            // Create a new reminder object (optional, depending on your application logic)
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
        console.error('Error scheduling reminders:', error.message);
        //res.status(400).send('Error scheduling reminders');
    }
}




// Exporting the functions
module.exports = {
	getUser,
	updateUser,
	getUserByUsername,
	scheduleReminder,
};
