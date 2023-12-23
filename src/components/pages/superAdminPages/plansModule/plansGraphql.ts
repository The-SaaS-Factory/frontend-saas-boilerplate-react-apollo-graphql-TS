import { gql } from "@apollo/client";

const GET_PLANS = gql`
  query GetAllPlans($projectId: Int) {
    getAllPlans(projectId: $projectId) {
      id
      name
      price
      oldPrice
      status
      group
      projectId
      description
      type
      settings {
        settingName
        settingValue
      }
      PlanCapabilities {
        planId
        name
        id
        count
        capabilitieId
        capabilitie {
          type
          name
          id
          description
        }
      }
    }
  }
`;

const GET_CAPABILITIES = gql`
  query GetCapabilities {
    getAllCapabilities {
      description
      id
      group
      name
      type
    }
  }
`;

const CREATE_PLAN = gql`
  mutation CreatePlan(
    $description: String
    $planId: Int
    $group: String
    $projectId: Int
    $price: Float
    $interval: String
    $name: String
    $oldPrice: Float
    $status: String
  ) {
    createPlan(
      planId: $planId
      description: $description
      price: $price
      projectId: $projectId
      interval: $interval
      name: $name
      group: $group
      oldPrice: $oldPrice
      status: $status
    ) {
      id
    }
  }
`;

const CONNECT_CAPABILITIE_WITH_PLAN = gql`
  mutation ConnectCapabilitieWithPlan(
    $planId: Int!
    $capabilitieId: Int!
    $count: Int
    $name: String
  ) {
    connectCapabilitieWithPlan(
      planId: $planId
      capabilitieId: $capabilitieId
      count: $count
      name: $name
    ) {
      planId
      name
      id
      count
      capabilitieId
    }
  }
`;

const CREATE_CAPABILITIE = gql`
  mutation CreateCapabilitie(
    $name: String!
    $description: String
    $type: String
    $group: String
  ) {
    createCapabilitie(
      name: $name
      description: $description
      type: $type
      group: $group
    ) {
      description
      name
      type
      id
    }
  }
`;
const DELETE_CAPABILITIE = gql`
  mutation DeleteCapabilitie($capabilitieId: Int!) {
    deleteCapabilitie(capabilitieId: $capabilitieId)
  }
`;

export {
  GET_PLANS,
  GET_CAPABILITIES,
  CREATE_PLAN,
  CONNECT_CAPABILITIE_WITH_PLAN,
  CREATE_CAPABILITIE,
  DELETE_CAPABILITIE,
};
