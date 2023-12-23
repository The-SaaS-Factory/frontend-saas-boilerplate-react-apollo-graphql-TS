import SuperAdminLayout from "@/components/layouts/SuperAdminLayout";
import LoginPage from "@/components/layouts/auth/LoginPage";
import { SignedIn, SignedOut, useOrganization } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SuperAdminRoot = () => {
  const { organization, isLoaded } = useOrganization();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !organization) {
      navigate("/");
    } else {
      if (organization && !organization.publicMetadata.isSuperAdmin) {
        navigate("/403");
      }
    }
  }, [isLoaded, organization]);

  return (
    <div>
      <SignedOut>
        <LoginPage />
      </SignedOut>
      <SignedIn>
        <div>
          <SuperAdminLayout />
        </div>
      </SignedIn>
    </div>
  );
};

export default SuperAdminRoot;
