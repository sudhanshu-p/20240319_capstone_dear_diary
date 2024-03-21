// External dependencies
require("dotenv").config();

// Models
const User = require("../models/User");
const Page = require("../models/Page");

// Validators
const userValidator = require("../validators/User");

// Get user details
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

// Update user details
async function updateUser(req, res) {
	const { description } = req.body.description;

	// Validate the user input
	if (!userValidator.validateDescription(description)) {
		return res.status(416).send("Invalid description");
	}

	try {
		const user = await User.find(req.user.id);

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

// Exporting the functions
module.exports = {
	getUser,
	updateUser,
	getUserByUsername,
};
