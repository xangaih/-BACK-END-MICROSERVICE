const { generateToken } = require('../utils/auth'); // Import function to generate JWT token
const User = require('../models/User'); // Import User model for database operations

async function login(req, res) { // Define the login function as an asynchronous function
    const { username, password } = req.body; // Destructure username and password from the request body
    
    // Find the user in the database by username
    const user = await User.findOne({ username }); 
    
    // Check if user exists and compare the provided password with the stored hashed password
    if (user && await bcrypt.compare(password, user.password)) {
        const token = generateToken(user); // Generate a JWT token for the authenticated user
        res.json({ token }); // Send the token as a JSON response
    } else {
        res.status(401).json({ error: 'Invalid credentials' }); // Send a 401 error response for invalid credentials
    }
}

module.exports = { login }; // Export the login function for use in other modules
