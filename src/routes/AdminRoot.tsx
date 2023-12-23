import AdminLayout from "@/components/layouts/AdminLayout";
import LoginPage from "@/components/layouts/auth/LoginPage";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

const AdminRoot = () => {
  return (
    <div>
      <SignedOut>
        <LoginPage />
      </SignedOut>
      <SignedIn>
        <div>
          <AdminLayout />
        </div>
      </SignedIn>
    </div>
  );
};
export default AdminRoot;
