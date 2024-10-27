const WebSocket = require('ws'); // Import the WebSocket library

// Create a new WebSocket server that listens on port 8080
const wss = new WebSocket.Server({ port: 8080 });

// Event listener for a new client connection
wss.on('connection', (ws) => {
    console.log('Client connected'); // Log when a client connects

    // Event listener for incoming messages from the client
    ws.on('message', (message) => {
        console.log('Received:', message); // Log the received message
    });

    // Send a welcome message to the newly connected client
    ws.send('Welcome to the notification service');
});

// Function to send notifications to all connected clients on ticket updates
function notifyClients(update) {
    wss.clients.forEach((client) => {
        // Check if the client is still connected
        if (client.readyState === WebSocket.OPEN) {
            // Send the update to the client in JSON format
            client.send(JSON.stringify(update));
        }
    });
}

// Export the notifyClients function for use in other modules
module.exports = { notifyClients };
