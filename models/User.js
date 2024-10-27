const mongoose = require('mongoose'); // Import Mongoose for MongoDB object modeling
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

// Define the user schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Unique username, required field
    password: { type: String, required: true }, // User password, required field
    role: { 
        type: String, // Role of the user
        enum: ['Admin', 'Agent', 'Customer'], // Allowed values for user roles
        default: 'Customer' // Default role set to 'Customer'
    },
    mfaEnabled: { type: Boolean, default: false }, // Indicates if multi-factor authentication is enabled
    mfaSecret: String // Secret used for multi-factor authentication
});

// Hash password before saving the user document
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) { // Check if the password field has been modified
        this.password = await bcrypt.hash(this.password, 12); // Hash the password with a salt round of 12
    }
    next(); // Proceed to the next middleware or save operation
});

// Export the User model based on the defined schema
module.exports = mongoose.model('User', userSchema);
