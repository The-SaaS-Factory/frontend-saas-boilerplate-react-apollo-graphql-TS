export type UserType = {
  id: string;
  username: string;
  email: string;
  avatar: string;
  name: string;
  phone: string;
  country: string;
  city: string;
  state: string;
  Membership: UserMembershipType[];
};

export type UserMembershipType = {
  id: string;
  endDate: string;
  plan: UserMembershipPlanType;
};

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

