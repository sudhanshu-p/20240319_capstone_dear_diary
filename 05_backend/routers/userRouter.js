// /users

// Setting up the express router
const express = require("express");
const router = express.Router();

// Importing the controller
const userController = require("../controllers/userController");
// Helper functions
const { verifyToken, ifAvailable, getUserMiddleware } = require("../helpers/helperFunctions");

// Routes
router.get("/", verifyToken, getUserMiddleware, userController.getUser);

router.put("/", verifyToken, userController.updateUser);

router.post("/habit", verifyToken, getUserMiddleware, userController.createHabit)

// router.get("/habits", verifyToken, userController.getHabitsofUser)

router.put("/habit/:id", verifyToken, getUserMiddleware, userController.updateHabit)

router.delete("/habit", verifyToken, getUserMiddleware, userController.deleteHabit)

router.get("/:username", ifAvailable, userController.getUserByUsername);

// router.post('/setreminder', verifyToken, userController.scheduleReminder);
// Exporting the router
module.exports = router;