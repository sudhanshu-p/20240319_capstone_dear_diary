// /page
// - GET /:title - Get a post by title
// - POST / - Create a new post
// - PUT /:title - Update a post
// - DELETE /:title - Delete a post
// - GET /search - Search for posts using a query, recent posts, or by author

// Setting up the express router
const express = require("express");
const router = express.Router();

// Importing the controller
const pageController = require("../controllers/pageController");

// Routes
router.get("/:title", pageController.getPageByTitle);

router.post("/", pageController.createPage);

router.put("/:title", pageController.updatePage);

router.delete("/:title", pageController.deletePage);

router.get("/search", pageController.searchPages);

// Exporting the router
module.exports = router;
