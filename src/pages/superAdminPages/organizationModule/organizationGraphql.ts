import { gql } from "@apollo/client";

const GET_ALL_ORGANIZATIONS = gql`
  query GetAllOrganizations {
    getAllOrganizations {
      id
      name
      user {
        id
        name
        avatar
      }
      Membership {
        id
        endDate
        startDate
        plan {
          id
          name
        }
      }
      Permission {
        id
        name
      }
    }
  }
`;
const GET_ALL_ORGANIZATIONS_WITH_PERMISSIONS = gql`
  query GetAllOrganizationsWithPermissions {
    getAllOrganizationsWithPermissions {
      id
      name
      user {
        id
        name
        avatar
      }
      Membership {
        id
        endDate
        startDate
        plan {
          id
          name
        }
      }
      Permission {
        id
        name
      }
    }
  }
`;

export { GET_ALL_ORGANIZATIONS, GET_ALL_ORGANIZATIONS_WITH_PERMISSIONS };
