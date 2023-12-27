import { PlanType } from "../plansModule/plansTypes";

export type OrganizationType = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  Membership: OrganizationMembershipType;
};

export type OrganizationMembershipType = {
  id: string;
  endDate: string;
  plan: PlanType;
};
