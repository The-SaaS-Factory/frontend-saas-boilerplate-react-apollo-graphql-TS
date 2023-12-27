import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import React from "react";
import ChevronRightIcon from "@heroicons/react/24/outline/ChevronRightIcon";

type Btn = {
  name: string;
  href?: string;
  icon?: React.ElementType | null;
  fn?: () => void;
};

type BreadcrumbItem = {
  name: string;
  href: string;
};

type PageNameProps = {
  name: string;
  btn1?: Btn;
  breadcrumbs?: BreadcrumbItem[];
};

const PageName = ({ name, btn1, breadcrumbs }: PageNameProps) => {
  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>{name}</title>
      </Helmet>

      <div className="lg:py-1">
        <div className="flex justify-between">
          <h1 className="text-title  font-semibold">{name}</h1>
          <div className="flex space-x-3 items-center">
            {btn1 &&
              (btn1.fn ? (
                <button onClick={btn1.fn} className="btn-icon ">
                  {" "}
                  {btn1.icon &&
                    React.createElement(btn1.icon, {
                      className: "h-5 w-5 text-primary",
                      "aria-hidden": "true",
                    })}
                  <span>{btn1.name}</span>
                </button>
              ) : (
                <Link to={btn1.href as string} className="btn-icon ">
                  {" "}
                  {btn1.icon &&
                    React.createElement(btn1.icon, {
                      className: "h-5 w-5 text-primary",
                      "aria-hidden": "true",
                    })}
                  <span>{btn1.name}</span>
                </Link>
              ))}
          </div>
        </div>
        <nav className="my-3 -ml-3 sm:flex" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-4">
            {breadcrumbs?.map((item, index) => (
              <li key={index}>
                <div className="flex items-center">
                  {index > 0 && (
                    <ChevronRightIcon
                      className="h-5 w-5 flex-shrink-0 text-primary"
                      aria-hidden="true"
                    />
                  )}
                  <Link
                    to={item.href}
                    className="ml-4 text-primary"
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
