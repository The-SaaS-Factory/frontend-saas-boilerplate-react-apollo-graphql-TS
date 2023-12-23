import { gql } from "@apollo/client";

const GET_PLANS = gql`
  query GetAllPlans {
    getAllPlans {
      id
      name
      price
      oldPrice
      status
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
const BUY_PLAN_FREE = gql`
  mutation BuyPlanFree($planId: Int!) {
    buyPlanFree(planId: $planId)
  }
`;
const GET_CAPABILITIES = gql`
  query GetCapabilities {
    getAllCapabilities {
      description
      id
      name
      type
    }
  }
`;

const CREATE_PLAN = gql`
  mutation CreatePlan(
    $description: String
    $planId: Int
    $price: Float
    $type: String
    $name: String
    $oldPrice: Float
    $status: String
  ) {
    createPlan(
      planId: $planId
      description: $description
      price: $price
      name: $name
      type: $type
      oldPrice: $oldPrice
      status: $status
    ) {
      id
      name
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
  ) {
    createCapabilitie(name: $name, description: $description, type: $type) {
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

const CONNECT_STRIPE_WITH_PLAN = gql`
  mutation ConnectStripePlanWithLocalPlan($planId: Int!) {
    connectStripePlanWithLocalPlan(planId: $planId)
  }
`;

const DELETE_PLAN = gql`
  mutation DeletePlan($planId: Int) {
    deletePlan(planId: $planId)
  }
`;

const DISCONECT_STRIPE_WITH_PLAN = gql`
  mutation DisconectStripePlanWithLocalPlan($planId: Int!) {
    disconectStripePlanWithLocalPlan(planId: $planId)
  }
`;

const GET_PAYMENTS_SETTINGS = gql`
  query GetPaymentsSettings {
    getPaymentsSettings {
      settingName
      settingValue
    }
  }
`;

export {
  GET_PLANS,
  GET_CAPABILITIES,
  CREATE_PLAN,
  CONNECT_CAPABILITIE_WITH_PLAN,
  CREATE_CAPABILITIE,
  DELETE_CAPABILITIE,
  DELETE_PLAN,
  CONNECT_STRIPE_WITH_PLAN,
  DISCONECT_STRIPE_WITH_PLAN,
  BUY_PLAN_FREE,
  GET_PAYMENTS_SETTINGS,
};
