// /auth
// - /register
// - /login

// Setting up the express router
const express = require("express");
const router = express.Router();

// Importing the controller
const authController = require("../controllers/authController");

// Routes

router.post("/register", authController.register);

router.post("/login", authController.login);

// Exporting the router

module.exports = router;