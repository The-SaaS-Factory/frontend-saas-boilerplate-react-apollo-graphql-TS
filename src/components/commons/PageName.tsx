import React, { useEffect } from "react";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ChevronRightIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

type Btn = {
  name: string;
  href?: string;
  icon?: any;
  fn?: () => void;
};

type BreadcrumbItem = {
  name: string;
  href: string;
};

type PageNameProps = {
  name: string;
  btn1?: Btn;
  breadcrumbs: BreadcrumbItem[];
};

const PageName = ({ name, btn1, breadcrumbs }: PageNameProps) => {
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const handleFullScreen = () => {
    const elem = document.getElementById("main");

    if (elem) {
      elem.classList.toggle("inset-0");
      elem.classList.toggle("absolute");
      elem.classList.toggle("z-50");
      elem.classList.toggle("bg-main");
      elem.classList.toggle("h-full");
      elem.classList.toggle("w-full");
      elem.classList.toggle("overflow-y-scroll");
      elem.classList.toggle("sm:rounded-lg");
      elem.classList.toggle("shadow-lg");
      elem.classList.toggle("p-4");
    }

    setIsFullScreen(!isFullScreen);
  };

  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>{name}</title>
      </Helmet>
      <div className="lg:py-3">
        <div className="flex justify-between">
          <h1 className="mega-title  font-semibold">{name}</h1>
          <div className="flex space-x-3 items-center">
            {btn1 &&
              (btn1.fn ? (
                <button onClick={btn1.fn} className="btn-main ">
                  {" "}
                  {btn1.icon &&
                    React.createElement(btn1.icon, {
                      className: "h-5 w-5 text",
                      "aria-hidden": "true",
                    })}
                  <span>{btn1.name}</span>
                </button>
              ) : (
                <Link to={btn1.href as string} className="btn-main ">
                  <btn1.icon
                    className="h-5 w-5 text-white "
                    aria-hidden="true"
                  />
                </Link>
              ))}

            <button onClick={handleFullScreen}>
              {!isFullScreen ? (
                <ArrowsPointingOutIcon
                  className="h-5 w-5 text"
                  aria-hidden="true"
                />
              ) : (
                <ArrowsPointingInIcon
                  className="h-5 w-5 text"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </div>
        <nav className="my-3 -ml-3 sm:flex" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-4">
            {breadcrumbs?.map((item, index) => (
              <li key={index}>
                <div className="flex items-center">
                  {index > 0 && (
                    <ChevronRightIcon
                      className="h-5 w-5 flex-shrink-0 text"
                      aria-hidden="true"
                    />
                  )}
                  <Link
                    to={item.href}
                    className="ml-4 text-sm font-medium text"
                  >
                    {item.name}
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </nav>
        <hr className="mb-1" />
      </div>
    </>
  );
};

export default PageName;
