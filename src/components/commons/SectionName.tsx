import React from "react";
import { Link } from "react-router-dom";

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

type SectionNameProps = {
  name: string;
  btn1?: Btn;
  breadcrumbs: BreadcrumbItem[];
};

const SectionName = ({ name, btn1, breadcrumbs }: SectionNameProps) => {
  return (
    <>
      <div className="lg:py-3">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">{name}</h1>
          {btn1 &&
            (btn1.fn ? (
              <button
                onClick={btn1.fn}
                className="flex btn-main justify-center px-4 py-2 m-3 border border-transparent rounded-md shadow-sm text-sm font-medium "
              >
                {" "}
                {btn1.icon &&
                  React.createElement(btn1.icon, {
                    className: "h-5 w-5 text-white",
                    "aria-hidden": "true",
                  })}
                <span>{btn1.name}</span>
              </button>
            ) : (
              <Link
                to={btn1.href as string}
                className="flex btn-main justify-center px-4 py-2 m-3 border border-transparent rounded-md shadow-sm text-sm font-medium "
              >
                <btn1.icon className="h-5 w-5 text-white" aria-hidden="true" />
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default SectionName;
