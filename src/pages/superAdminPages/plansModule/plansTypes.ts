import {  UserType } from "@/utils/types/globalsTypes";
import { InvoiceType } from "../../adminPages/billingModule/billingTypes";
import { OrganizationType } from "../organizationModule/organizationTypes";

export type UserMembershipPlanType = {
  id: string;
  name: string;
  price: string;
  group: string;
  status: string;
  oldPrice: string;
  type: string;
  settings: string;
  PlanCapabilities: UserMembershipPlanCapabilitieType[];
};

export type UserMembershipPlanCapabilitieType = {
  id: string;
  name: string;
  type: string;
  capabilitieId: string;
  count: string | number;
};

export type MembershipType = {
  id: string;
  user: UserType;
  endDate: string;
  plan: PlanType;
  invoice: InvoiceType;
  startDate: string;
  organization: OrganizationType;
};




export type PlanType = {
  name: string;
};