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
