// /page
// - GET /:url - Get a post by title
// - POST / - Create a new post
// - PUT /:title - Update a post
// - DELETE /:title - Delete a post
// - GET /search - Search for posts using a query, recent posts, or by author

// Setting up the express router
const express = require("express");
const router = express.Router();

// Importing the controller
const pageController = require("../controllers/pageController");

// Internal dependencies
const { verifyToken, getUserMiddleware } = require("../helpers/helperFunctions")

// Routes
router.get("/search", pageController.searchPages);

router.get("/:url", pageController.getPageByUrl);

router.post("/", verifyToken, getUserMiddleware, pageController.createPage);

router.put("/:url", verifyToken, pageController.updatePage);

router.delete("/:url", verifyToken, pageController.deletePage);

// Exporting the router
module.exports = router;
