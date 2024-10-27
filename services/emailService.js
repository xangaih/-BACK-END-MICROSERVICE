const sgMail = require('@sendgrid/mail'); // Import the SendGrid mail library
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Set the API key from environment variables for authentication

// Function to send an email
function sendEmail(to, subject, text) {
    const msg = {
        to, // Recipient email address
        from: 'support@example.com', // Sender email address (replace with your verified SendGrid sender)
        subject, // Subject line of the email
        text, // Plain text body of the email
    };
    
    sgMail.send(msg) // Send the email using SendGrid
        .then(() => {
            console.log('Email sent successfully'); // Log success message
        })
        .catch((error) => {
            console.error('Error sending email:', error); // Log any error that occurs while sending
        });
}

// Export the sendEmail function for use in other modules
module.exports = { sendEmail };
