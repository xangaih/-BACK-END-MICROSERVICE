const { buildSchema } = require('graphql');

module.exports = buildSchema(`
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

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
