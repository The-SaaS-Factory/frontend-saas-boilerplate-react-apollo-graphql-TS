/* eslint-disable @typescript-eslint/no-explicit-any */
import { classNames } from "@/utils/facades/strFacade";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavigationSection {
  sectionName: string;
  items: NavigationItem[];
}

type NavigationItem = {
  name: string;
  href: string;
  icon: any;
  current: boolean;
};

const Navigation = ({
  setSidebarOpen,
  navigation,
}: {
  setSidebarOpen: (state: boolean) => void;
  navigation: NavigationSection[];
}) => {
  //Change current by path
  const location = useLocation();
  const pathName = useLocation().pathname;
  const [links, setLinks] = useState<NavigationSection[]>([]);

  useEffect(() => {
    const linksWithStatus = navigation.map((section) => {
      return {
        ...section,
        items: section.items.map((item) => {
          return {
            ...item,
            current: item.href === location.pathname,
          };
        }),
      };
    });

    setLinks(linksWithStatus);
  }, [location]);

  return (
    <li>
      <ul role="list" className="-mx-2 space-y-1">
        {links.map((section) => (
          <div key={section.sectionName}>
            <span className="text-xs font-semibold leading-6 text-primary">
              {section.sectionName}
            </span>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {section.items.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={classNames(
                      item.href === pathName
                        ? "bg-main-selected text-primary-selected"
                        : " bg-main-hover",
                      "group flex gap-x-3 rounded-md p-2  text-primary"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.href === pathName
                          ? "text-primary-selected"
                          : "text-primary",
                        "h-6 w-6 shrink-0 text-primary-hover"
                      )}
                      aria-hidden="true"
                    />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </ul>
    </li>
  );
};

export default Navigation;
