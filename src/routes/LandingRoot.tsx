import React from "react";
import { Outlet } from "react-router-dom";

const LandingRoot = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default LandingRoot;
