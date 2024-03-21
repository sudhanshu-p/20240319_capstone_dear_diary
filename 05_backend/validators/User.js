// Validator for the user model

async function validateUsername(username) {
  // Username must be alphanumeric and between 6 and 16 characters long
  return /^[a-zA-Z0-9_]{6,16}$/.test(username);
}

async function validateEmail(email) {
  // Email must be valid
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function validatePassword(password) {
  // Password must be at least 8 characters long
  // and contain at least one uppercase letter, one lowercase letter, one number, and one special character
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,}$/.test(
    password
  );
}

async function validateDescription(description) {
  // Description must be between 10 and 500 characters long
  return description.length >= 10 && description.length <= 500;
}

module.exports = {
  validateUsername,
  validateEmail,
  validatePassword,
  validateDescription,
};
