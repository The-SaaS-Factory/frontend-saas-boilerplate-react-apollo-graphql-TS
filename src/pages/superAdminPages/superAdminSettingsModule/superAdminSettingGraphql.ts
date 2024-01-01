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

const GET_MODULES = gql`
  query GetModules {
    getModules {
      id
      name
      scope
      status
      createdAt
      updatedAt
      Permission {
        id
        name
        description
      }
      Organization {
        id
        name
      }
    }
  }
`;

const GET_PERMISSIONS = gql`
  query GetPermissions {
    getPermissions {
      id
      name
      Module {
        id
        name
      }
    }
  }
`;

const ADD_PERMISSION_TO_MODULE = gql`
  mutation AddPermissionToModule($moduleId: Int!, $permissionId: Int!) {
    addPermissionToModule(moduleId: $moduleId, permissionId: $permissionId) {
      id
      name
      scope
      status
      Permission {
        id
        name
      }
    }
  }
`;

const REMOVE_PERMISSION_FROM_MODULE = gql`
  mutation RemovePermissionFromModule($moduleId: Int!, $permissionId: Int!) {
    removePermissionFromModule(
      moduleId: $moduleId
      permissionId: $permissionId
    ) {
      id
      name
      Permission {
        id
        name
      }
    }
  }
`;

const ADD_ORGANIZATION_TO_MODULE = gql`
  mutation AddOrganizationToModule($moduleId: Int!, $organizationId: Int!) {
    addOrganizationToModule(
      moduleId: $moduleId
      organizationId: $organizationId
    ) {
      id
      name
      scope
      status
      Organization {
        id
        name
      }
    }
  }
`;

const REMOVE_ORGANIZATION_FROM_MODULE = gql`
  mutation RemoveOrganizationFromModule(
    $moduleId: Int!
    $organizationId: Int!
  ) {
    removeOrganizationFromModule(
      moduleId: $moduleId
      organizationId: $organizationId
    ) {
      id
      name
      scope
      status
      Organization {
        id
        name
      }
    }
  }
`;

const ADD_PERMISSION_TO_ORGANIZATION = gql`
  mutation AddPermissionToOrganization(
    $organizationId: Int!
    $permissionId: Int!
  ) {
    addPermissionToOrganization(
      organizationId: $organizationId
      permissionId: $permissionId
    ) {
      id
      name
    }
  }
`;

const REMOVE_PERMISSION_FROM_ORGANIZATION = gql`
  mutation RemovePermissionFromOrganization(
    $organizationId: Int!
    $permissionId: Int!
  ) {
    removePermissionFromOrganization(
      organizationId: $organizationId
      permissionId: $permissionId
    ) {
      id
      name
    }
  }
`;

export {
  SAVE_SUPER_ADMIN_SETTINGS,
  GET_SUPER_ADMIN_SETTINGS,
  GET_MODULES,
  GET_PERMISSIONS,
  ADD_PERMISSION_TO_MODULE,
  REMOVE_PERMISSION_FROM_MODULE,
  REMOVE_ORGANIZATION_FROM_MODULE,
  ADD_ORGANIZATION_TO_MODULE,
  ADD_PERMISSION_TO_ORGANIZATION,
  REMOVE_PERMISSION_FROM_ORGANIZATION,
};
