const isValidEmail = (email) => {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const generateCode = () => {
    const min = 100000000;
    const max = 999999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


// REGEX STATES:
// Must have uppercase and lowercase letter.
// Must have a digit.
// Must have a special character.
// Must be 12 characters and not longer than 30.

// CHECKS SOON TO BE ADDED:
// Consecutive Characters
// No spaces

var passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\d\s]).{12,30}$/g

const verifyPasswordValid = (password) => {6
    return passwordRegex.test(password)
}

module.exports = {
    isValidEmail,
    generateCode,
    verifyPasswordValid
}