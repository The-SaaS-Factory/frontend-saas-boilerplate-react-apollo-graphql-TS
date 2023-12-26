import { gql } from "@apollo/client";

const GET_CURRENT_USER = gql`
  query Me {
    me {
      id
      name
    }
  }
`;

const GET_USER_NOTIFICATIONS = gql`
  query GetUserNotification($userId: Int) {
    getUserNotification(userId: $userId) {
      id
      type
      image
      content
      viewed
    }
  }
`;

const NEW_NOTIFICATION = gql`
  subscription NewInternalNotification($userId: Int!) {
    newInternalNotification(userId: $userId) {
      userId
      content
      notificationsCount
    }
  }
`;

const VIEWED_NOTIFICATIONS = gql`
  mutation Mutation {
    markNotificationsAsRead
  }
`;


export {
  GET_CURRENT_USER,
  GET_USER_NOTIFICATIONS,
  NEW_NOTIFICATION,
  VIEWED_NOTIFICATIONS,
  
};
