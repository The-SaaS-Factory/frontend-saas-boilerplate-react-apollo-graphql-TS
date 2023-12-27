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
    }
  }
`;

export { GET_ALL_ORGANIZATIONS };
