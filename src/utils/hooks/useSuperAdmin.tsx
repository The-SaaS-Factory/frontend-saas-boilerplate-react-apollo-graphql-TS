import { useEffect, useState } from "react";
import { systemScope } from "../constants/globalContants";
import { useOrganization, useUser } from "@clerk/clerk-react";

export const checkSuperAdminPermission = (permissions: string[]) => {
  console.log(permissions);
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
const useSuperAdmin = () => {
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const { organization } = useOrganization();
  const { user } = useUser();
 
  useEffect(() => {
    try {
      if (systemScope === "organization") {
        if (
          organization &&
          checkSuperAdminPermission(organization.publicMetadata?.permissions as string[])
        ) {
          setIsSuperAdmin(true);
        }
      } else {
        if (
          user &&
          checkSuperAdminPermission(user.publicMetadata?.permissions as string[])
        ) {
          setIsSuperAdmin(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return {
    isSuperAdmin,
  };
};

export default useSuperAdmin;
