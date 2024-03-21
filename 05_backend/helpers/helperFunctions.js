const jwt = require('jsonwebtoken');
const User = require("../models/User")
require('dotenv').config();

function verifyToken(req, res, next) {
    // Get token from Authorization header of format "Bearer <token>"
    const token = req.headers.authorization.split(" ")[1]; 

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

async function getUserMiddleware(req, res, next) {
    const user = await User.findOne({ _id: req.user.id })

    if (!user) {
        return res.status(401).json({ message: "Invalid user credentials" })
    }

    req.user = user
    next()
}

function formatToTitle(username, title) {
    // "My First Blog" -> username-my-first-blog
    return `${username}-${title.toLowerCase().split(" ").join("-")}`
}

module.exports = { verifyToken, getUserMiddleware, formatToTitle };