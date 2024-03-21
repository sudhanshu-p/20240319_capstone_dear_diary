// Validations for the Post model

async function validateTitle(title) {
	// Title must be a string with length between 1 and 100
	return typeof title === "string" && title.length >= 1 && title.length <= 100;
}

async function validateContent(content) {
	// Content must be a string with min length 100 and no max length
	return typeof content === "string" && content.length >= 100;
}

async function validateAuthor(author) {
	// Author must be an ObjectId
	return mongoose.Types.ObjectId.isValid(author);
}

async function validateVisibility(visibility) {
	// Visibility must be a string with value "public" or "private"
	return visibility === "public" || visibility === "private";
}

module.exports = {
	validateTitle,
	validateContent,
	validateAuthor,
	validateVisibility,
};
