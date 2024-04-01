// internal dependencies
const User = require('../models/User')
const Follow = require('../models/follwing')
const admin = require("firebase-admin");

async function follow(req,res){
    try {
        const toFollowUserId = req.body.userid; // ID of the user to be followed
        const followerUserId = req.user.id; 

        console.log(toFollowUserId);
        console.log(followerUserId);
        // Check if the user to be followed exists
        const userToFollow = await User.findById(toFollowUserId);
        if (!userToFollow) {
            return res.status(404).json({ message: 'User to follow not found.' });
        }

        // Check if the follower is trying to follow themselves
        if (toFollowUserId === followerUserId) {
            return res.status(400).json({ message: 'You cannot follow yourself.' });
        }

        // Check if the follow relationship already exists
        const existingFollow = await Follow.findOne({
            follower: followerUserId,
            following: toFollowUserId
        });

        if (existingFollow) {
            return res.status(400).json({ message: 'You are already following this user.' });
        }

        // Create a new follow relationship
        const newFollow = new Follow({
            follower: followerUserId,
            following: toFollowUserId
        });

        await newFollow.save();

        // Assuming the user model has a field for the Firebase token
        const token = userToFollow.fmcToken; 

        // Send notification to the followed user
        if (token) {
            await admin.messaging().send({
                token: token,
                notification: {
                    title: 'New Follower',
                    body: `You have a new follower!`,
                },
            })
            .then((response) => {
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.error('Error sending message:', error);
            });
        }

        res.status(201).json({ message: 'User followed successfully.' });
    } catch (error) {
        console.error('Follow Error:', error);
        res.status(500).json({ message: 'An error occurred while trying to follow the user.' });
    }
}


async function unfollow(req, res, next) {
    try {
        const toUnfollowUserId = req.body.userid; // ID of the user to be unfollowed
        const followerUserId = req.user.id; // Assuming req.user is populated with the logged-in user's data

        // Check if the user to be unfollowed exists
        const userToUnfollow = await User.findById(toUnfollowUserId);
        if (!userToUnfollow) {
            return res.status(404).json({ message: 'User to unfollow not found.' });
        }

        // Check if the follower is trying to unfollow themselves (optional, based on your logic)
        if (toUnfollowUserId === followerUserId) {
            return res.status(400).json({ message: 'You cannot unfollow yourself.' });
        }

        // Check if the follow relationship exists
        const existingFollow = await Follow.findOne({
            follower: followerUserId,
            following: toUnfollowUserId
        });

        if (!existingFollow) {
            return res.status(400).json({ message: 'You are not following this user.' });
        }

        // Remove the follow relationship
        await Follow.deleteOne({
            follower: followerUserId,
            following: toUnfollowUserId
        });

        res.status(200).json({ message: 'User unfollowed successfully.' });
    } catch (error) {
        console.error('Unfollow Error:', error);
        res.status(500).json({ message: 'An error occurred while trying to unfollow the user.' });
    }
}



module.exports = {follow,unfollow}