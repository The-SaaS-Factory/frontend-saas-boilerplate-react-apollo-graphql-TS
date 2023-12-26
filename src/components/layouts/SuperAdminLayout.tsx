/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  BuildingLibraryIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  FolderIcon,
  HomeIcon,
  LifebuoyIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import { Link, Outlet, useLocation } from "react-router-dom";
import { OrganizationSwitcher, UserButton } from "@clerk/clerk-react";
import { classNames } from "@/utils/facades/strFacade";

export default function SuperAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-24 w-auto"
                        src="/assets/img/logo.png"
                        alt="Your Company"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <Navigation setSidebarOpen={setSidebarOpen} />
                        <li className="mt-auto">
                          <Link
                            onClick={() => setSidebarOpen(false)}
                            to="/admin/settings"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                          >
                            <Cog6ToothIcon
                              className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                              aria-hidden="true"
                            />
                            Settings
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col ">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-24 w-auto"
                src="/assets/img/logo.png"
                alt="Your Company"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <Navigation setSidebarOpen={setSidebarOpen} />

                <li className="mt-auto">
                  <Link
                    onClick={() => setSidebarOpen(false)}
                    to="/admin/settings"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                  >
                    <Cog6ToothIcon
                      className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                      aria-hidden="true"
                    />
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72  ">
          <SuperAdminHeader setSidebarOpen={setSidebarOpen} />

          <main className="py-3">
            <div className="mx-auto   px-4  ">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

const Navigation = ({
  setSidebarOpen,
}: {
  setSidebarOpen: (state: boolean) => void;
}) => {
  const [adminNavigation, setAdminNavigation] = useState([
    {
      sectionName: "General",
      items: [
        { name: "Dashboard", href: "/admin", icon: HomeIcon, current: true },
        { name: "Users", href: "/admin/users", icon: UsersIcon, current: false },
        { name: "Organizations", href: "#", icon: FolderIcon, current: false },
      ],
    },
    {
      sectionName: "Billing",
      items: [
        {
          name: "Plans",
          href: "/admin/billing",
          icon: CreditCardIcon,
          current: true,
        },
        {
          name: "Subscriptions",
          href: "/admin/suscriptions",
          icon: BuildingLibraryIcon,
          current: false,
        },
      ],
    },
    {
      sectionName: "Support",
      items: [
        {
          name: "Tickets",
          href: "/admin/support/tickets",
          icon: LifebuoyIcon,
          current: true,
        },
      ],
    },
  ]);

  //Change current by path
  const location = useLocation();
  const pathName = useLocation().pathname;

  useEffect(() => {
    const newAdminNavigation = adminNavigation.map((section) => {
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

    setAdminNavigation(newAdminNavigation);
  }, [location]);

  return (
    <li>
      <ul role="list" className="-mx-2 space-y-1">
        {adminNavigation.map((section) => (
          <div key={section.sectionName}>
            <span className="text-xs font-semibold leading-6 text-gray-400">
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
                        ? "bg-gray-50 text-indigo-600"
                        : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.href === pathName
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-indigo-600",
                        "h-6 w-6 shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
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

const SuperAdminHeader = ({
  setSidebarOpen,
}: {
  setSidebarOpen: (state: boolean) => void;
}) => {
  return (
    <div>
      {" "}
      <div className="sticky top-0 z-40 lg:mx-auto ">
        <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative p-4  flex flex-1">
              <OrganizationSwitcher />
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Link
                to={"/admin/notifications"}
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </Link>

              {/* Separator */}
              <div
                className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                aria-hidden="true"
              />

              {/* Profile dropdown */}
              <div className="pr-7">
                <UserButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
