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

const GET_ALL_USERS = gql`
  query GetUsers($offset: Int, $limit: Int, $search: String) {
    getUsers(offset: $offset, limit: $limit, search: $search) {
      id
      name
      Membership {
        id
        plan {
          name
        }
        startDate
        endDate
      }
      avatar
      email
    }
  }
`;

export {
  GET_CURRENT_USER,
  GET_USER_NOTIFICATIONS,
  NEW_NOTIFICATION,
  VIEWED_NOTIFICATIONS,
  GET_ALL_USERS,
};
