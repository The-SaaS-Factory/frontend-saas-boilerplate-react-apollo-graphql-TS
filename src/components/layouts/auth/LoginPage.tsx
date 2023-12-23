import { SignIn } from "@clerk/clerk-react";
import React from "react";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <SignIn />
    </div>
  );
};

export default LoginPage;
