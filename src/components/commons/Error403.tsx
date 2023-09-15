import React from "react";

const Error403 = () => {
  return (
    <div className="p-7 inset-0 fixed z-50 bg-white flex items-center ">
      <div className="flex flex-col mx-auto">
        <span className=" font-medium text-center">Error 403</span>
        <img src="/assets/img/403.png" className="max-h-96" alt="403" />
        <span className=" font-medium text-center">You do not have access to this page</span>
      </div>
    </div>
  );
};

export default Error403;
