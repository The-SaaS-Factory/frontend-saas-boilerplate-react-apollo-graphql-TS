import { SignIn } from "@clerk/clerk-react";
 
const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <SignIn
       afterSignInUrl={"/home"}
       afterSignUpUrl={"/home"}
      />
    </div>
  );
};

export default LoginPage;
