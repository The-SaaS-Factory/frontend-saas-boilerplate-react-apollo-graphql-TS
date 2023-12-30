/* eslint-disable @typescript-eslint/no-explicit-any */
export type SuperAdminSetting = {
  settingName: string;
  settingValue: string;
};

export type ModuleType = {
  id: string;
  name: string;
  status: string;
  scope: string;
  Organization: any;
  Permission: PermissionType[];
};

export type PermissionType = {
  id: string;
  name: string;
};
