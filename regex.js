const isValidEmail = (email) => {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const generateCode = () => {
    const min = 10000000; // Minimum value (inclusive)
    const max = 99999999; // Maximum value (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
    isValidEmail,
    generateCode
}