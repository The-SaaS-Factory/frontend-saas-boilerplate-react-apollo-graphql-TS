export const getSettingValue = (values: any, key: string) => {
  return values?.find((setting) => setting.settingName === key)?.settingValue ?? null;
};
