# Ticketing System Documentation

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Database Models](#database-models)
4. [Authentication & Authorization](#authentication--authorization)
5. [API Endpoints](#api-endpoints)
6. [Services](#services)
7. [GraphQL Schema](#graphql-schema)
8. [Setup & Configuration](#setup--configuration)

## Overview

This is a comprehensive ticketing system built with Node.js, Express, and MongoDB. The system supports ticket management, user authentication, real-time notifications, and analytics capabilities. It's designed to handle support tickets with various priorities and statuses while providing features like email notifications and performance tracking.

### Key Features
- User authentication with role-based access control
- Ticket management with priority levels and status tracking
- Real-time notifications via WebSocket
- Email notifications using SendGrid
- Analytics and performance metrics
- GraphQL API support
- Multi-factor authentication support

## System Architecture

The system follows a modular architecture with the following components:

```
src
└── ├── controllers/
    │   ├── userController.js
    │   └── ticketController.js
    ├── models/
    │   ├── User.js
    │   └── Ticket.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── services/
    │   ├── analyticsService.js
    │   ├── emailService.js
    │   └── notificationService.js
    ├── routes/
    │   └── ticketRoutes.js
    └── schema/
    │    └── schema.js
    └── config/
    │    └── db.js
    └── graphql/
    │    ├── resolver.js
    │    ├── schema.js
    └── utils/
    │    └── auth.js
docker-compose.yml
Dockerfile
```

## Database Models

### User Model
```javascript
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['Admin', 'Agent', 'Customer'],
        default: 'Customer'
    },
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: String
});
```

### Ticket Model
```javascript
const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [String],
    createdAt: { type: Date, default: Date.now }
});
```

## Authentication & Authorization

### JWT Authentication
The system uses JSON Web Tokens (JWT) for authentication. The authentication flow includes:

1. User login through `/login` endpoint
2. Token generation using `generateToken()` utility
3. Token verification using `authenticate` middleware

```javascript
// Authentication Middleware
function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            const decoded = verifyToken(token);
            req.user = decoded;
            next();
        } catch (err) {
            res.status(403).json({ error: 'Invalid or expired token' });
        }
    } else {
        res.status(401).json({ error: 'No token provided' });
    }
}
```

### Multi-Factor Authentication
The system supports MFA with the following features:
- Toggle MFA through `mfaEnabled` field
- Store MFA secret in `mfaSecret` field
- Verification required during login when MFA is enabled

## Services

### Analytics Service
Provides performance metrics and insights:

```javascript
// Get agent performance metrics
async function getAgentPerformance() {
    return await Ticket.aggregate([
        {
            $group: {
                _id: '$assignedTo',
                resolvedTickets: { $sum: 1 }
            }
        }
    ]);
}

// Calculate average resolution time
async function getAverageResolutionTime() {
    return await Ticket.aggregate([
        {
            $match: { status: 'Resolved' }
        },
        {
            $group: {
                _id: null,
                avgTime: { $avg: { $subtract: ['$resolvedAt', '$createdAt'] } }
            }
        }
    ]);
}
```

### Email Service
Handles email notifications using SendGrid:

```javascript
const sgMail = require('@sendgrid/mail');

function sendEmail(to, subject, text) {
    const msg = {
        to,
        from: 'support@example.com',
        subject,
        text,
    };
    
    return sgMail.send(msg);
}
```

### Notification Service
Provides real-time updates via WebSocket:

```javascript
const wss = new WebSocket.Server({ port: 8080 });

function notifyClients(update) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(update));
        }
    });
}
```

## GraphQL Schema

The system provides a GraphQL API with the following schema:

```graphql
type Ticket {
    id: ID!
    title: String!
    description: String!
    status: String!
    priority: String!
}

input TicketInput {
    title: String!
    description: String!
    priority: String
}

type RootQuery {
    tickets: [Ticket!]!
}

type RootMutation {
    createTicket(ticketInput: TicketInput): Ticket
}
```

## Setup & Configuration

### Prerequisites
- Node.js v14 or higher
- MongoDB v4.4 or higher
- SendGrid API key for email notifications

### Environment Variables
```
MONGODB_URI=mongodb://localhost:27017/ticketing
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
```

### Installation Steps
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start the server: `npm start`

### Security Considerations
- Passwords are hashed using bcrypt with 12 salt rounds
- JWT tokens are required for protected routes
- Role-based access control is implemented
- MFA is available for additional security

## API Usage Examples

### Creating a Ticket
```javascript
// POST /api/tickets
const response = await fetch('/api/tickets', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer <token>',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: 'New Issue',
        description: 'Description of the issue',
        priority: 'High'
    })
});
```

### User Authentication
```javascript
// POST /api/login
const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        username: 'user@example.com',
        password: 'password123'
    })
});
```
