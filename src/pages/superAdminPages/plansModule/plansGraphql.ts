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
const GET_ALL_SUBSCRIPTIONS = gql`
  query GetAllSubscriptions {
    getAllSubscriptions {
      endDate
      id
      plan {
        name
        id
        type
      }
      startDate
      invoice {
        gateway
        amount
      }
      organization {
        id
        name
      }
      user {
        id
        email
        name
        avatar
      }
      userId
    }
  }
`;

const GET_PLAN_BY_NAME = gql`
  query GetPlanByName($name: String!) {
    getPlanByName(name: $name) {
      id
      name
      PlanCapabilities {
        id
        name
        count
        capabilitieId
        planId
        capabilitie {
          id
          name
          type
        }
      }
      description
      price
      status
      type
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

const GET_USER_CAPABILITIES = gql`
  query GetUserCapabilitie {
    getUserCapabilitie {
      count
      userId
      capabilitieId
    }
  }
`;
const GET_ORGANIZATION_CAPABILITIES = gql`
  query GetOrganizationCapabilies($organizationId: Int) {
    getOrganizationCapabilies(organizationId: $organizationId) {
      id
      capabilitieId
      count
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
  GET_PLAN_BY_NAME,
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
  GET_USER_CAPABILITIES,
  GET_ORGANIZATION_CAPABILITIES,
  GET_ALL_SUBSCRIPTIONS,
};
