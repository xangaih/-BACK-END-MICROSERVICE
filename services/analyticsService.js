const Ticket = require('../models/ticket.js'); // Import the Ticket model for MongoDB operations

// Function to get performance metrics of agents based on resolved tickets
async function getAgentPerformance() {
    return await Ticket.aggregate([
        { 
            $group: { 
                _id: '$assignedTo', // Group tickets by the agent (assignedTo field)
                resolvedTickets: { $sum: 1 } // Count the number of resolved tickets per agent
            } 
        }
    ]);
}

// Function to calculate the average resolution time for resolved tickets
async function getAverageResolutionTime() {
    return await Ticket.aggregate([
        { 
            $match: { status: 'Resolved' } // Filter to include only resolved tickets
        },
        { 
            $group: { 
                _id: null, // No specific group, aggregate over the entire result set
                avgTime: { $avg: { $subtract: ['$resolvedAt', '$createdAt'] } } // Calculate average resolution time
            } 
        }
    ]);
}

// Export the functions for use in other modules
module.exports = { getAgentPerformance, getAverageResolutionTime };
