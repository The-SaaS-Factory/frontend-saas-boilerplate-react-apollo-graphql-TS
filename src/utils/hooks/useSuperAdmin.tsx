import { useEffect, useState } from "react";
import { systemScope } from "../constants/globalContants";
import { useOrganization, useUser } from "@clerk/clerk-react";


export const checkModulePermission = (
  permissions: string[],
  module: string
) => {
  if (permissions && permissions.length > 0) {
    const modulePermissions = permissions.filter((permission) =>
      permission.startsWith(module)
    );
    if (modulePermissions.length > 0) {
      return true;
    }
  }
  return false;
};

  
export const hasSuperAdminPermission = (permissions: string[]) => {
  if (permissions && permissions.length > 0) {
    const superAdminPermissions = permissions.filter((permission) =>
      permission.startsWith("superAdmin")
    );
    if (superAdminPermissions.length > 0) {
      return true;
    }
  }
  return false;
};

const useSuperAdmin = (moduleName?: string) => {
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [hasModulePermission, setHasModulePermission] =
    useState<boolean>(false);
  const { organization } = useOrganization();
  const { user } = useUser();

  useEffect(() => {
    try {
      if (systemScope === "organization" && organization) {
        if (
          hasSuperAdminPermission(
            organization.publicMetadata?.permissions as string[]
          )
        ) {
          setIsSuperAdmin(true);

          if (moduleName) {
            setHasModulePermission(
              checkModulePermission(
                organization.publicMetadata?.permissions as string[],
                moduleName
              )
            );
          }
        }
      } else {
        if (
          user &&
          hasSuperAdminPermission(
            user.publicMetadata?.permissions as string[]
          )
        ) {
          setIsSuperAdmin(true);

          if (moduleName) {
            setHasModulePermission(
              checkModulePermission(
                user.publicMetadata?.permissions as string[],
                moduleName
              )
            );
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  

  return {
    isSuperAdmin,
    hasModulePermission,
  };
};

export default useSuperAdmin;
