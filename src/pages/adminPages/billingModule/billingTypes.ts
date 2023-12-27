import { UserType } from "@/utils/types/globalsTypes";

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
