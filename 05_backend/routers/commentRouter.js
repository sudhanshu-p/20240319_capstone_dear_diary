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

// Routes

router.post("/upvote/:title", commentController.upvotePage);

router.post("/downvote/:title", commentController.downvotePage);

router.post("/comment/:title", commentController.commentOnPage);

router.post("/:title/comments/upvote", commentController.upvoteComment);

router.post("/:title/comments/downvote", commentController.downvoteComment);

router.post("/:title/comments/reply", commentController.replyToComment);

router.delete("/:title/comments", commentController.deleteComment);

// Exporting the router
module.exports = router;