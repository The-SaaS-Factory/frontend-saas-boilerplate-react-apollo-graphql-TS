export type SuperAdminSetting = {
  settingName: string;
  settingValue: string;
};


export interface Permission {
  name: string;
  description: string;
  id: string;
}

export type SupportTicketContentInput = {
  content: string;
  type: string;
};

export type MembershipType = {
  id: string;
  user: UserType;
  endDate: string;
  plan: PlanType;
  invoice: InvoiceType;
  startDate: string;
};

export type InvoiceType = {
  id: string;
  user: UserType;
  endDate: string;
  currency: CurrencyType;
  amount: string;
};

export type CurrencyType = {
  id: string;
  name: UserType;
};

export type PlanType = {
  name: string;
};

export type UserType = {
  id: string;
  username: string;
  avatar: string;
  name: string;
  country: string;
  city: string;
  state: string;
  Membership: UserMembershipType;
};
export type UserInputType = {
  limit: number;
  offset: number;
  search: string;
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
  status: string;
  oldPrice: string;
  type: string;
  settings: string;
  PlanCapabilities: UserMembershipPlanCapabilitieType[];
};

export type FormValuesCreatePlan = {
  firstName: string;
  lastName: string;
  email: string;
};

export type UserMembershipPlanCapabilitieType = {
  id: string;
  name: string;
  type: string;
  capabilitieId: string;
  count: string | number;
};

export type KpiType = {
  id: string;
  name: string;
  type: string;
  value: number;
  createdAt: string;
  updatedAt: string;
};
export type KpiStatType = {
  name: string;
  value: string | number;
  createdAt?: string;
  statGrowth?: string | number;
  oldestValue: string | number;
  items: KpiGrowthType[];
};

export type KpiGrowthType = {
  value: number;
  name: string | number;
  createdAt: string;
  updatedAt: string;
};
export type LanguageType = {
  id: string;
  lng: string;
  name: string;
};

 
export type ResourceType = {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string;
  linkDownload: string;
  linkVideo: string;
  linkDemo: string;
  resume: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};
export type Image = {
  data_url: string;
};
