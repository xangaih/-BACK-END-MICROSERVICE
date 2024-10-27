const mongoose = require('mongoose'); // Import Mongoose for MongoDB object modeling

// Define the ticket schema
const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Title of the ticket, required field
    description: { type: String, required: true }, // Description of the ticket, required field
    status: { 
        type: String, // Current status of the ticket
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'], // Allowed values for status
        default: 'Open' // Default value set to 'Open'
    },
    priority: { 
        type: String, // Priority level of the ticket
        enum: ['Low', 'Medium', 'High'], // Allowed values for priority
        default: 'Medium' // Default value set to 'Medium'
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user assigned to the ticket
    tags: [String], // Array of tags associated with the ticket
    createdAt: { type: Date, default: Date.now }, // Timestamp of when the ticket was created, defaults to current date
});

// Export the Ticket model based on the defined schema
module.exports = mongoose.model('Ticket', ticketSchema);
