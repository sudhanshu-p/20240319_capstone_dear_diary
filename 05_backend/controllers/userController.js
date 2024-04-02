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
	// if (!userValidator.validateDescription(description)) {
	// 	return res.status(416).send("Invalid description");
	// }

	try {
		console.log(req.user)
		const user = await User.findByIdAndUpdate(req.user.id,req.body,{new:true})

		if (!user) {
			return res.status(404).send("Account does not exist");
		}

		user.description = description;
		await user.save();
		res.status(200).json({message:"User details updated"});
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

// Exporting the functions
module.exports = {
	getUser,
	updateUser,
	getUserByUsername,
};
