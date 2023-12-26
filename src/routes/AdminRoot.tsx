import AdminLayout from "@/components/layouts/AdminLayout";
import LoginPage from "@/components/layouts/auth/LoginPage";
import useCkeckScopeSystem from "@/utils/hooks/useCkeckScopeSystem";
import { CreateOrganization, SignedIn, SignedOut } from "@clerk/clerk-react";

const AdminRoot = () => {
  const { needCreateOrganization } = useCkeckScopeSystem();
  return (
    <div>
      <SignedOut>
        <LoginPage />
      </SignedOut>
      <SignedIn>
        <div>
          {needCreateOrganization ? (
            <div className="flex justify-center items-center h-screen">
              <CreateOrganization afterCreateOrganizationUrl={"/home"} />
            </div>
          ) : (
            <AdminLayout />
          )}
        </div>
      </SignedIn>
    </div>
  );
};
export default AdminRoot;
