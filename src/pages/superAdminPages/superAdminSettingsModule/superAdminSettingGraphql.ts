import { gql } from "@apollo/client";

const SAVE_SUPER_ADMIN_SETTINGS = gql`
  mutation SaveAdminSetting($settings: [SuperAdminSetting]) {
    saveAdminSetting(settings: $settings)
  }
`;

 
const GET_SUPER_ADMIN_SETTINGS = gql`
  query GetSuperAdminSettings {
    getSuperAdminSettings {
      settingName
      settingValue
    }
  }
`;


export { SAVE_SUPER_ADMIN_SETTINGS, GET_SUPER_ADMIN_SETTINGS };