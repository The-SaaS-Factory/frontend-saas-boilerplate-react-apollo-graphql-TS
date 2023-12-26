import { gql } from "@apollo/client";

const CREATE_SUPPORT_TICKET = gql`
  mutation CreateSupportTicket(
    $subject: String
    $departament: String
    $contents: [SupportTicketContentInput]
  ) {
    createSupportTicket(
      subject: $subject
      departament: $departament
      contents: $contents
    ) {
      id
    }
  }
`;

const GET_USER_SUPPORT_TICKETS = gql`
  query GetSupportTicketsForUser {
    getSupportTicketsForUser {
      createdAt
      departament
      id
      status
      subject
      updatedAt
      userId
    }
  }
`;

const ADD_MESSAGE_TO_SUPPORT_TICKET = gql`
  mutation CreateMessageForSupportTicket(
    $ticketId: Int!
    $contents: [SupportTicketContentInput]
  ) {
    createMessageForSupportTicket(ticketId: $ticketId, contents: $contents) {
      id
    }
  }
`;

const CLOSE_SUPPORT_TICKET = gql`
  mutation CloseSupportTicket($ticketId: Int!) {
    closeSupportTicket(ticketId: $ticketId)
  }
`;

const GET_SUPPORT_TICKET = gql`
  query GetSupportTicket($ticketId: Int) {
    getSupportTicket(ticketId: $ticketId) {
      createdAt
      departament
      id
      status
      subject
      SupportTicketMessage {
        id
        createdAt
        userId
        user {
          id
          email
          avatar
          Membership {
            id
            plan {
              name
            }
          }
          name
        }
        SupportTicketMessageContent {
          content
          type
          updatedAt
          createdAt
        }
      }
      updatedAt
      userId
    }
  }
`;

const GET_ALL_TICKETS = gql`
  query GetSupportTickets {
    getSupportTickets {
      id
      subject
      departament
      status
      createdAt
      updatedAt
    }
  }
`;

export {
  CREATE_SUPPORT_TICKET,
  GET_USER_SUPPORT_TICKETS,
  ADD_MESSAGE_TO_SUPPORT_TICKET,
  CLOSE_SUPPORT_TICKET,
  GET_SUPPORT_TICKET,
  GET_ALL_TICKETS
};
