const jwt = require('jsonwebtoken');
const dateStreak = require('date-streaks')
const User = require("../models/User")
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

/**
 * 
 * @param {Date} previousPostDate 
 * @param {Date} currentDate 
 */
// function setStreak(previousPostDate, currentDate) {

//     console.log(previousPostDate.getMonth(), currentDate.getMonth())

//     if (previousPostDate.getMonth() === currentDate.getMonth()) {
//         console.log(previousPostDate.getDate(), currentDate.getDate())
//         if (currentDate.getDate() - previousPostDate.getDate() === 1||0) {
//             console.log("Same month and consicutive date")
//             return 1
//         }
//     } else if (previousPostDate.getMonth() + 1 === currentDate.getMonth()) {
//         console.log("Next Month")
//         if (previousPostDate.getMonth() === 2 ) {
//             if((previousPostDate.getDate() === 28 | 29) && (currentDate.getDate()===1)){
//                 return 1
//             }
//         } else {
//             if((previousPostDate.getDate() === 30 | 31) && (currentDate.getDate()===1)){
//                 return 1
//             }

//         }
//     } else {
//         return -1
//     }

// }

function setStreak(dates) {
    
    console.log(dateStreak.summary({dates: dates}))
}
dates =  [new Date(2024, 2, 32), new Date(2024, 3, 1)]
console.log(
    "output here " + setStreak(dates)
)

module.exports = { verifyToken, getUserMiddleware, formatToUrl };