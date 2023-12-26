import { gql } from "@apollo/client";

const GET_CURRENT_USER = gql`
  query Me {
    me {
      id
      name
    }
  }
`;

export { GET_CURRENT_USER };
