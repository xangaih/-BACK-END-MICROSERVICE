const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library to handle JWT operations

// Function to generate a JSON Web Token (JWT) for a user
function generateToken(user) {
    // Sign the token with user ID and role, using a secret key from the environment variables
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Function to verify a given JSON Web Token (JWT)
function verifyToken(token) {
    try {
        // Verify the token using the secret key from the environment variables
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        // Throw an error if the token is invalid
        throw new Error('Invalid Token');
    }
}

// Export the generateToken and verifyToken functions for use in other modules
module.exports = { generateToken, verifyToken };
