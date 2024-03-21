// Models
const Comment = require("../models/Comment");
const Page = require("../models/Page");

// Validators
const commentValidator = require("../validators/Comment");

// Upvote a page
async function upvotePage(req, res) {
	const { title } = req.params;

	try {
		const page = await Page.findOne({ title });

		if (!page) {
			return res.status(404).send("Page not found");
		}

		// If the user has already upvoted the page, undo the upvote
		if (page.upvoted_by.includes(req.user.id)) {
			const index = page.upvoted_by.indexOf(req.user.id);
			page.upvoted_by.splice(index, 1);
			await page.save();

			return res.status(200).send("Upvote removed");
		}

		page.upvoted_by.push(req.user.id);
		await page.save();

		res.status(200).send("Page upvoted");
	} catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
}

// Downvote a page
async function downvotePage(req, res) {
	const { title } = req.params;

	try {
		const page = await Page.findOne({ title });

		if (!page) {
			return res.status(404).send("Page not found");
		}

		// If the user has already downvoted the page, undo the downvote
		if (page.downvoted_by.includes(req.user.id)) {
			const index = page.downvoted_by.indexOf(req.user.id);
			page.downvoted_by.splice(index, 1);
			await page.save();

			return res.status(200).send("Downvote removed");
		}

		page.downvoted_by.push(req.user.id);
		await page.save();

		res.status(200).send("Page downvoted");
	} catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
}

// Comment on a page
async function commentOnPage(req, res) {
	const { title } = req.params;
	const { content } = req.body;

	// Validate the user input
	if (!commentValidator.validateContent(content)) {
		return res.status(418).send("Invalid content");
	}

	try {
		const page = await Page.findOne({ title });

		if (!page) {
			return res.status(404).send("Page not found");
		}

		const comment = new Comment({
			content,
			author: req.user.id,
			parent_type: "post",
			replies: [],
			upvoted_by: [],
			downvoted_by: [],
		});

		await comment.save();

		page.comments.push(comment._id);
		await page.save();

		res.status(201).send(comment);
	} catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
}

// Upvote a comment
async function upvoteComment(req, res) {
	const { title } = req.params;
	const { comment_id } = req.body;

	try {
		const page = await Page.findOne({ title });

		if (!page) {
			return res.status(404).send("Page not found");
		}

		const comment = await Comment.findOne({ _id: comment_id });

		if (!comment) {
			return res.status(404).send("Comment not found");
		}

		// If the user has already upvoted the comment, undo the upvote
		if (comment.upvoted_by.includes(req.user.id)) {
			const index = comment.upvoted_by.indexOf(req.user.id);
			comment.upvoted_by.splice(index, 1);
			await comment.save();

			return res.status(200).send("Upvote removed");
		}

		comment.upvoted_by.push(req.user.id);
		await comment.save();

		res.status(200).send("Comment upvoted");
	} catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
}

// Downvote a comment
async function downvoteComment(req, res) {
	const { title } = req.params;
	const { comment_id } = req.body;

	try {
		const page = await Page.findOne({ title });

		if (!page) {
			return res.status(404).send("Page not found");
		}

		const comment = await Comment.findOne({ _id: comment_id });

		if (!comment) {
			return res.status(404).send("Comment not found");
		}

		// If the user has already downvoted the comment, undo the downvote
		if (comment.downvoted_by.includes(req.user.id)) {
			const index = comment.downvoted_by.indexOf(req.user.id);
			comment.downvoted_by.splice(index, 1);
			await comment.save();

			return res.status(200).send("Downvote removed");
		}

		comment.downvoted_by.push(req.user.id);
		await comment.save();

		res.status(200).send("Comment downvoted");
	}
	catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
}

// Reply to a comment
async function replyToComment(req, res) {
	const { title } = req.params;
	const { comment_id, content } = req.body;

	// Validate the user input
	if (!commentValidator.validateContent(content)) {
		return res.status(418).send("Invalid content");
	}

	try {
		const page = await Page.findOne({ title });

		if (!page) {
			return res.status(404).send("Page not found");
		}

		const parentComment = await Comment.findOne({ _id: comment_id });

		if (!parentComment) {
			return res.status(404).send("Comment not found");
		}

		const comment = new Comment({
			content,
			author: req.user.id,
			parent_type: "comment",
			upvoted_by: [],
			downvoted_by: [],
		});

		await comment.save();

		parentComment.replies.push(comment._id);
		await parentComment.save();

		res.status(201).send(comment);
	}
	catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
}

// Delete a comment
async function deleteComment(req, res) {
	const { title } = req.params;
	const { comment_id } = req.body;

	try {
		const page = await Page.findOne({ title });

		if (!page) {
			return res.status(404).send("Page not found");
		}

		const comment = await Comment.findOne({ _id: comment_id });

		if (!comment) {
			return res.status(404).send("Comment not found");
		}

		// Check if the user is the author of the comment
		if (comment.author.toString() !== req.user.id.toString()) {
			return res.status(403).send("Unauthorized");
		}

		// Delete the comment
		await Comment.deleteOne({ _id: comment_id });

		// Remove the comment from the parent's replies
		if (comment.parent_type === "page") {
			const index = page.comments.indexOf(comment_id);
			page.comments.splice(index, 1);
			await page.save();
		}
		else {
			const parentComment = await Comment.findOne({ replies: comment_id });
			const index = parentComment.replies.indexOf(comment_id);
			parentComment.replies.splice(index, 1);
			await parentComment.save();
		}

		res.status(200).send("Comment deleted");
	}
	catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
}

module.exports = {
	upvotePage,
	downvotePage,
	commentOnPage,
	upvoteComment,
	downvoteComment,
	replyToComment,
	deleteComment,
};