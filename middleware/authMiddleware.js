const { verifyToken } = require('../utils/auth'); // Import the verifyToken function from the auth utility

// Middleware function to authenticate requests
function authenticate(req, res, next) {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1]; // Use optional chaining to avoid errors if the header is missing

    // Check if a token is provided
    if (token) {
        try {
            // Verify the token and decode user information
            const decoded = verifyToken(token);
            req.user = decoded; // Attach user info to the request object for later use
            next(); // Call the next middleware or route handler
        } catch (err) {
            // If token verification fails, respond with a forbidden error
            res.status(403).json({ error: 'Invalid or expired token' });
        }
    } else {
        // If no token is provided, respond with an unauthorized error
        res.status(401).json({ error: 'No token provided' });
    }
}

module.exports = authenticate; // Export the authenticate middleware for use in other parts of the application
