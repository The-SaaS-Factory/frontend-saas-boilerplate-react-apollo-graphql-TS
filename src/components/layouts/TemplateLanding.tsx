import { Outlet } from "react-router";
import { lazy } from "react";

const Footer = lazy(() => import("../commons/Footer"));
const HeaderLanding = lazy(() => import("../commons/HeaderLanding"));

const TemplateLanding = () => {
  return (
    <div className="flex flex-col space-y-16">
      <div className="w-full absolute z-40 g-main pt-2 font-medium h-10 text-center">
        <span>
          {" "}
          <a href="https://thesaasfactory.dev">
            Buy this boilerplate in{" "}
            <span className="text-sky-500"> thesaasfactory.dev</span>
          </a>
        </span>
      </div>
      <HeaderLanding />
      <div className="w-full   max-w-7xl  mx-auto">
        <Outlet />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default TemplateLanding;
