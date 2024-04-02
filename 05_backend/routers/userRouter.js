// /user
// - PUT / - Update user details (primarily description)
// - GET / - Get user details, including user posts.

// Setting up the express router
const express = require("express");
const router = express.Router();

// Importing the controller
const userController = require("../controllers/userController");
const { verifyToken, ifAvailable } = require("../helpers/helperFunctions");

// Routes
router.put("/", verifyToken, userController.updateUser);

router.get("/", userController.getUser);

router.get("/:username",ifAvailable, userController.getUserByUsername);

// Exporting the router
module.exports = router;