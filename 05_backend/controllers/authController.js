// External dependencies
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Model
const { User } = require("../models/User");

// Validators
const userValidator = require("../validators/User");

// Register
/** Register
 * @async
 * @param {Object} req - Request object. Mandatory fields: username, email, password
 * @param {Object} res - Response object
 * @returns {Object} - Returns a token if the user is successfully registered
 * @returns {Object} - Returns an error if the user is not successfully registered. 
 */
async function register(req, res) {
  // Get the user input
  const { username, email, password } = req.body;
  console.log(req.body)
  try {
    // Validate the user input
    if (!userValidator.validateUsername(username)) {
      return res.status(411).send("Invalid username");
    }

    if (!userValidator.validateEmail(email)) {
      return res.status(412).send("Invalid email");
    }

    if (!userValidator.validatePassword(password)) {
      return res.status(413).send("Invalid password");
    }

    // Check if the username already exists
    let user = await User.findOne({ username });

    if (user) {
      return res.status(414).send("Username is taken");
    }

    // Check if the user email already exists
    user = await User.findOne({ email });

    if (user) {
      return res.status(415).send("Email already in use");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Create a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Save the user after token creation so any error doesn't result in discrepency
    await user.save();

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}

// Login
/** Login
 * @async
 * @param {Object} req - Request object. Mandatory fields: userKey, password
 * @param {Object} res - Response object
 * @returns {Object} - Returns a token if the user is successfully logged in
 * @returns {Object} - Returns an error if the user is not successfully logged in.
*/
async function login(req, res) {
  // Get the user input
  const { userKey, password } = req.body;
  console.log(req.body)
  try {
    // If the userKey is an email
    let user = await User.findOne({ email: userKey });
    if (!user) {
      // If the userKey is a username
      user = await User.findOne({ username: userKey });
    }

    if (!user) {
      return res.status(404).send("Account does not exists");
    }

    // Compare the passwords

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    // Create a token

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}

async function checkJwt(req, res) {
  let token
  try {
    token = req.headers.authorization.split(" ")[1];
  }
  catch (error) {
    res.status(403).send("No token found")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      res.status(200)
    }
  }
  catch (error) {
    res.status(401).send("Token expired.")
  }
}

module.exports = { register, login, checkJwt };
