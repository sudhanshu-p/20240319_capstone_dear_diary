// Models
const Comment = require("../models/Comment");
const Page = require("../models/Page");

// Validators
const commentValidator = require("../validators/Comment");

/** Upvote a page
 * @async
 * @param {Object} req - Request object. Mandatory fields: url
 * @param {Object} res - Response object
 * @returns {Object} - Returns a message if the page is successfully upvoted
 * @returns {Object} - Returns an error if the page is not successfully upvoted
 */
async function upvotePage(req, res) {
	const { url } = req.params;

	try {
		const page = await Page.findOne({ url });

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

		// If the user has downvoted the page, undo the downvote
		if (page.downvoted_by.includes(req.user.id)) {
			const index = page.downvoted_by.indexOf(req.user.id);
			page.downvoted_by.splice(index, 1);
		}

		page.upvoted_by.push(req.user.id);
		await page.save();

		res.status(200).send("Page upvoted");
	} catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
}

/** Downvote a page
 * @async
 * @param {Object} req - Request object. Mandatory fields: url
 * @param {Object} res - Response object
 * @returns {Object} - Returns a message if the page is successfully downvoted
 * @returns {Object} - Returns an error if the page is not successfully downvoted
 */
async function downvotePage(req, res) {
	const { url } = req.params;

	try {
		const page = await Page.findOne({ url });

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

		// If the user has upvoted the page, undo the upvote
		if (page.upvoted_by.includes(req.user.id)) {
			const index = page.upvoted_by.indexOf(req.user.id);
			page.upvoted_by.splice(index, 1);
		}

		page.downvoted_by.push(req.user.id);
		await page.save();

		res.status(200).send("Page downvoted");
	} catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
}

/** Comment on a page
 * @async
 * @param {Object} req - Request object. Mandatory fields: url, content
 * @param {Object} res - Response object
 * @returns {Object} - Returns the comment if the comment is successfully created
 * @returns {Object} - Returns an error if the comment is not successfully created
 */
async function commentOnPage(req, res) {
	const { url } = req.params;
	const { content } = req.body;

	// Validate the user input
	if (!commentValidator.validateContent(content)) {
		return res.status(418).send("Invalid content");
	}

	try {
		const page = await Page.findOne({ url });

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

/** Upvote a comment
 * @async
 * @param {Object} req - Request object. Mandatory fields: url, comment_id
 * @param {Object} res - Response object
 * @returns {Object} - Returns a message if the comment is successfully upvoted
 * @returns {Object} - Returns an error if the comment is not successfully upvoted
 */
async function upvoteComment(req, res) {
	const { url } = req.params;
	const { comment_id } = req.body;

	try {
		const page = await Page.findOne({ url });

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

		// If the user has downvoted the comment, undo the downvote
		if (comment.downvoted_by.includes(req.user.id)) {
			const index = comment.downvoted_by.indexOf(req.user.id);
			comment.downvoted_by.splice(index, 1);
		}

		comment.upvoted_by.push(req.user.id);
		await comment.save();

		res.status(200).send("Comment upvoted");
	} catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
}

/** Downvote a comment
 * @async
 * @param {Object} req - Request object. Mandatory fields: url, comment_id
 * @param {Object} res - Response object
 * @returns {Object} - Returns a message if the comment is successfully downvoted
 * @returns {Object} - Returns an error if the comment is not successfully downvoted
 */
async function downvoteComment(req, res) {
	const { url } = req.params;
	const { comment_id } = req.body;

	try {
		const page = await Page.findOne({ url });

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

		// If the user has upvoted the comment, undo the upvote
		if (comment.upvoted_by.includes(req.user.id)) {
			const index = comment.upvoted_by.indexOf(req.user.id);
			comment.upvoted_by.splice(index, 1);
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

/** Reply to a comment
 * @async
 * @param {Object} req - Request object. Mandatory fields: url, comment_id, content
 * @param {Object} res - Response object
 * @returns {Object} - Returns the reply if the reply is successfully created
 * @returns {Object} - Returns an error if the reply is not successfully created
 */
async function replyToComment(req, res) {
	const { url } = req.params;
	const { comment_id, content } = req.body;

	// Validate the user input
	if (!commentValidator.validateContent(content)) {
		return res.status(418).send("Invalid content");
	}

	try {
		const page = await Page.findOne({ url });

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

/** Delete a comment
 * @async
 * @param {Object} req - Request object. Mandatory fields: url, comment_id
 * @param {Object} res - Response object
 * @returns {Object} - Returns a message if the comment is successfully deleted
 * @returns {Object} - Returns an error if the comment is not successfully deleted
 */
async function deleteComment(req, res) {
	const { url } = req.params;
	const { comment_id } = req.body;

	try {
		const page = await Page.findOne({ url });

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

		// Check if the comment has any replies
		if (comment.replies.length > 0) {
			// Delete the replies
			await Comment.deleteMany({ _id: { $in: comment.replies } });
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