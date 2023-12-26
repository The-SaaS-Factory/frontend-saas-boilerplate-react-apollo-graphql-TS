import { useEffect, useState } from "react";
import { systemScope } from "../constants/globalContants";
import { useOrganization, useUser } from "@clerk/clerk-react";

const useSuperAdmin = () => {
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const { organization } = useOrganization();
  const { user } = useUser();

  useEffect(() => {
    try {
      if (systemScope === "organization") {
        if (organization && organization.publicMetadata.isSuperAdmin) {
          setIsSuperAdmin(true);
        }
      } else {
        if (user && user.publicMetadata.isSuperAdmin) {
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
