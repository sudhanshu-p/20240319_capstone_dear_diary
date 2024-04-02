// External dependencies
require("dotenv").config();

// Models
const User = require("../models/User");
const Page = require("../models/Page");


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
	console.log(username);
	const { user } = req
	console.log(user);
	// console.log(user.id);


	try {
		const user = await User.findOne({ username });
		console.log(user);
		if (!user) {
			return res.status(404).send("User not found");
		}

		const profileData = await User.aggregate([
			{
				$match: {
					username: user.username
				}
			},
			{
				$lookup: {
					from: 'follows',
					localField: '_id',
					foreignField: 'following',
					as: 'followerof'
				}
			},
			{
				$lookup: {
					from: 'follows',
					localField: '_id',
					foreignField: 'follower',
					as: 'followingto'
				}
			},
			{
				$addFields: {
					followersCount: {
						$size: "$followerof"
					},
					followingCount: {
						$size: "$followingto"
					},


				}

			},
			{
				$addFields: {
					isFollowing: {
						$cond: {
							if: { $in: ['66037bbd1733e61d260cea5f', "$followerof.follower"] },
							then: true,
							else: false
						}
					}
				}
			},
			// {
			// 	$project: {
			// 		followersCount: 1,
			// 		followingCount: 1,
			// 		isFollowing:1,


			// 	}
			// }
		])
		console.log(profileData);
		// Get the user's pages
		const pages = await Page.find({ author: user._id });
		// user.pages = pages;
		// user.profileData = profileData;

		res.status(200).json({ "user": user, "pages": pages, "followData": profileData });
	} catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
}


// Define an asynchronous function to handle creating a new habit
async function postHabits(req, res) {
    try {
        // Retrieve user details from the database based on the user ID extracted from the token
        const user = await User.findOne({ _id: req.user.id });

        // If user does not exist, respond with status code 404 and a message indicating the account does not exist
        if (!user) {
            return res.status(404).send("Account does not exist");
        }

        // Extract data (title, frequency, time) from request body
        const { title, frequency, time } = req.body;

        // Create a new habit using the Habit model and provided data
        const habit = await Habit.create({ title, frequency, time, userId: req.user.id });

        // Respond with status code 201 (created) and JSON object containing the created habit
        return res.status(201).json({ habit });
    } catch (error) {
        // If an error occurs during the process, respond with status code 500 (internal server error)
        // and send a JSON object containing the error message
        return res.status(500).json({ error: error.message });
    }
}


async function getHabitsofUser(req, res) {
	try {
        // Extract habit ID from the request parameters
        const { id } = req.params;
        
        // Assuming you have middleware to extract user ID from token
        const userId = req.user.id; // Extract the user ID from the token

        // Find the habit with the provided ID that belongs to the current user
        const habit = await Habit.findOne({ _id: id, userId });

        // If habit is not found, respond with status code 404 and a message indicating habit not found
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Respond with status code 200 (OK) and JSON object containing the habit
        return res.json({ habit });
    } catch (error) {
        // If an error occurs during the process, respond with status code 500 (internal server error)
        // and send a JSON object containing the error message
        return res.status(500).json({ error: error.message });
    }

}
async function updateHabitsofUser(req, res){
	try {
        // Extract habit ID from the request parameters
        const { id } = req.params;
        
        // Extract data (title, frequency, time) from request body
        const { title, frequency, time } = req.body;
        
        // Assuming you have middleware to extract user ID from token
        const userId = req.user.id; // Extract the user ID from the token

        // Find and update the habit with the provided ID that belongs to the current user
        const habit = await Habit.findOneAndUpdate({ _id: id, userId }, { title, frequency, time }, { new: true });

        // If habit is not found, respond with status code 404 and a message indicating habit not found
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Respond with status code 200 (OK) and JSON object containing the updated habit
        return res.json({ habit });
    } catch (error) {
        // If an error occurs during the process, respond with status code 500 (internal server error)
        // and send a JSON object containing the error message
        return res.status(500).json({ error: error.message });
    }
}
async function updateHabitsofUser(req, res){
	try {
        // Extract habit ID from the request parameters
        const { id } = req.params;
        
        // Assuming you have middleware to extract user ID from token
        const userId = req.user.id; // Extract the user ID from the token

        // Find and delete the habit with the provided ID that belongs to the current user
        const habit = await Habit.findOneAndDelete({ _id: id, userId });

        // If habit is not found, respond with status code 404 and a message indicating habit not found
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Respond with status code 200 (OK) and JSON object containing a success message
        return res.json({ message: 'Habit deleted successfully' });
    } catch (error) {
        // If an error occurs during the process, respond with status code 500 (internal server error)
        // and send a JSON object containing the error message
        return res.status(500).json({ error: error.message });
    }

}

async function deleteHabitsofUser(req, res){try {
	// Extract habit ID from the request parameters
	const { id } = req.params;
	
	// Assuming you have middleware to extract user ID from token
	const userId = req.user.id; // Extract the user ID from the token

	// Find and delete the habit with the provided ID that belongs to the current user
	const habit = await Habit.findOneAndDelete({ _id: id, userId });

	// If habit is not found, respond with status code 404 and a message indicating habit not found
	if (!habit) {
		return res.status(404).json({ message: 'Habit not found' });
	}

	// Respond with status code 200 (OK) and JSON object containing a success message
	return res.json({ message: 'Habit deleted successfully' });
} catch (error) {
	// If an error occurs during the process, respond with status code 500 (internal server error)
	// and send a JSON object containing the error message
	return res.status(500).json({ error: error.message });
}


}
// Exporting the functions
module.exports = {
	getUser,
	updateUser,
	getUserByUsername,
	postHabits,
	getHabitsofUser,
	updateHabitsofUser,
	deleteHabitsofUser

};
