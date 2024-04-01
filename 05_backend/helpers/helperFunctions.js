const jwt = require('jsonwebtoken');
const User = require("../models/User")
const Page = require("../models/Page")
require('dotenv').config();

/** Verifies the token in the Authorization header
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
function verifyToken(req, res, next) {
    // Get token from Authorization header of format "Bearer <token>"
    const token = req.headers.authorization.split(" ")[1];

    console.log(token)

    if (!token) {
        return res.status(401).send('No token detected');
    }

    try {
        console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }

    catch (error) {
        res.status(401).send('Invalid token');
    }
}

/** Middleware to get the user from the database
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
async function getUserMiddleware(req, res, next) {
    const user = await User.findOne({ _id: req.user.id })

    if (!user) {
        return res.status(401).json({ message: "Invalid user credentials" })
    }

    req.user = user
    next()
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

async function getFullPage(url) {
    const full_page = await Page.aggregate(
        [
            {
                $match: { url: "Sudhanshu12-test-blog-029" },
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "comments",
                    foreignField: "_id",
                    as: "comments",
                },
            }
        ]
    );
    return full_page[0];
}

module.exports = { verifyToken, getUserMiddleware, formatToUrl, getFullPage };