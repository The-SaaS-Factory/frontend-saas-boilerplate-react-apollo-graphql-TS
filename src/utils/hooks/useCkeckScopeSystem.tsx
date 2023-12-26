import { useEffect, useMemo, useState } from "react";
import { systemScope } from "../constants/globalContants";
import { useUser } from "@clerk/clerk-react";

const useCkeckScopeSystem = () => {
  const [needCreateOrganization, setNeedCreateOrganization] = useState(false);
  const user = useUser();

  useEffect(() => {
    if (
      systemScope === "organization" &&
      user.user &&
      user.user.organizationMemberships?.length > 0
    ) {
      setNeedCreateOrganization(false);
    } else {
      setNeedCreateOrganization(true);
    }
  }, [user]);

  const memoizedValues = useMemo(() => {
    return {
      needCreateOrganization,
    };
  }, [needCreateOrganization]);

  return memoizedValues;
};

export default useCkeckScopeSystem;
