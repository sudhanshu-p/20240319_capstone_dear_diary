// /pages
// POST	/pages/upvote/:title - Upvote a page
// POST	/pages/downvote/:title - Downvote a page
// POST	/pages/comment/:title - Comment on a page
// POST	/pages/:title/comments/upvote - Upvote a comment
// POST	/pages/:title/comments/downvote - Downvote a comment
// POST	/pages/:title/comments/reply - Reply to a comment
// DELETE /pages/:title/comments - Delete a comment

// Setting up the express router
const express = require("express");
const router = express.Router();

// Importing the controller
const commentController = require("../controllers/commentController");

// Helpers
const { verifyToken, getUserMiddleware } = require("../helpers/helperFunctions")

// Routes

router.post("/upvote/:url", verifyToken, commentController.upvotePage);

router.post("/downvote/:url", verifyToken, commentController.downvotePage);

router.post("/comment/:url", verifyToken, commentController.commentOnPage);

router.post("/:url/comments/upvote", verifyToken, commentController.upvoteComment);

router.post("/:url/comments/downvote", verifyToken, commentController.downvoteComment);

router.post("/:url/comments/reply", verifyToken, commentController.replyToComment);

router.delete("/:url/comments", verifyToken, commentController.deleteComment);

// Exporting the router
module.exports = router;