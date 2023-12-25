 
import { gql } from "@apollo/client";

const GET_USER_MEMBERSHIPS = gql`
  query GetUserMemberships($userId: Int) {
    getUserMemberships(userId: $userId) {
      id
      startDate
      endDate
      plan {
        PlanCapabilities {
          capabilitie {
            description
            id
            name
            type
          }
          capabilitieId
          count
          id
          name
          planId
        }
        description
        id
        group
        name
        price
        type
      }
    }
  }
`;
 

export { GET_USER_MEMBERSHIPS };
