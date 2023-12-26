import { gql } from "@apollo/client";

const GET_KPIS = gql`
  query GetKpis($period: Int) {
    getKpis(period: $period) {
      id
      name
      type
      value
      createdAt
      updatedAt
    }
  }
`;

export { GET_KPIS };
