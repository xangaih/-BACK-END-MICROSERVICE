const express = require('express');
const { createTicket } = require('../controllers/ticketController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Protected route: only authenticated users can create a ticket
router.post('/tickets', authenticate, createTicket);

module.exports = router;

