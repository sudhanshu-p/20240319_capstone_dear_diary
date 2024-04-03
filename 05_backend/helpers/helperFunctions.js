const jwt = require('jsonwebtoken');
const User = require("../models/User")
require('dotenv').config();

/** Verifies the token in the Authorization header
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
function verifyToken(req, res, next) {
    // Get token from Authorization header of format "Bearer <token>"
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).send('No authorization header found');
    }

    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).send('Invalid authorization header format');
    }

    const token = tokenParts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send('Invalid token');
    }
}
async function getUserMiddleware(req, res, next) {
    try {
        const user = await User.findOne({ _id: req.user.id });

        if (!user) {
            return res.status(401).json({ message: "Invalid user credentials" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


/** Formats the title to be used in the URL into the format "username-title"
 * @param {String} username - The username of the user
 * @param {String} title - The title of the blog
 * @returns {String} - The formatted title
 */
function formatToUrl(username, title) {
    // "My First Blog" -> username-my-first-blog
    return `${username}-${title.toLowerCase().split(" ").join("-")}`
}

module.exports = { verifyToken, getUserMiddleware, formatToUrl };