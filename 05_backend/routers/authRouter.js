// /auth
// - /register
// - /login

// Setting up the express router
const express = require("express");
const router = express.Router();

// Importing the controller
const authController = require("../controllers/authController");

// Routes

// Swagger documentation for the /register route

/**
 * @swagger
 * /auth/register:
 * post:
 * summary: Register a new user
 * description: Register a new user
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * username:
 * type: string
 * description: The username of the user
 * password:
 * type: string
 * description: The password of the user
 * required:
 * - username
 * - password
 * responses:
 * 200:
 * description: A successful response
 * 400:
 * description: Bad request
 * 500:
 * description: Internal server error
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 * post:
 * summary: Login a user
 * description: Login a user
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * username:
 * type: string
 * description: The username of the user
 * password:
 * type: string
 * description: The password of the user
 * required:
 * - username
 * - password
 * responses:
 * 200:
 * description: A successful response
 * 400:
 * description: Bad request
 * 500:
 * description: Internal server error
 */
router.post("/login", authController.login);

module.exports = router;