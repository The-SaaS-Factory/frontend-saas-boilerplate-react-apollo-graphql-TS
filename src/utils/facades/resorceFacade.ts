/* eslint-disable @typescript-eslint/no-explicit-any */

import { SettingType } from "@/pages/superAdminPages/plansModule/PlansComponent";

export const getSettingValue = (values: any, key: string) => {
  if (values === undefined) return null;
  if (Object.keys(values).length === 0) return null;
  return (
    values?.find((setting: SettingType) => setting.settingName === key)
      ?.settingValue ?? null
  );
};
