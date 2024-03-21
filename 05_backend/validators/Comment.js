// Validations for the Comment model

function validateContent(content) {
    // Content must be a string with min length 1 and max length 1000
    return typeof content === "string" && content.length >= 1 && content.length <= 1000;
}

// Export the validation function
module.exports = {
    validateContent,
};