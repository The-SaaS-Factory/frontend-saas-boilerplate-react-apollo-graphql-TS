import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router";
import Error403 from "../commons/Error403";
const PrivatePages = ({ middleware = "admin" }: { middleware: string }) => {
  const { token, isSuperAdmin } = useSelector((state: any) => state.auth);

 
  return (
    <div>
      {!token ? (
        <Navigate to="/auth/login/login" replace={true} />
      ) : middleware === "admin" ? (
        <Outlet />
      ) : middleware === "superAdmin" ? (
        isSuperAdmin ? (
          <Outlet />
        ) : (
          <Error403 />
        )
      ) : (
        <Navigate to="/" replace={true} />
      )}
    </div>
  );
};

export default PrivatePages;
