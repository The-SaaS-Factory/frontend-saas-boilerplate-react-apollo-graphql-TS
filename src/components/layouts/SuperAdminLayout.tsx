/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  BuildingLibraryIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  DocumentTextIcon,
  FolderIcon,
  HomeIcon,
  LifebuoyIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import { Link, Outlet } from "react-router-dom";
import { OrganizationSwitcher, UserButton } from "@clerk/clerk-react";

import Navigation from "../core/Navigation";

export default function SuperAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const adminNavigation = [
    {
      sectionName: "General",
      items: [
        { name: "Dashboard", href: "/admin", icon: HomeIcon, current: true },
        {
          name: "Users",
          href: "/admin/users",
          icon: UsersIcon,
          current: false,
        },
        {
          name: "Organizations",
          href: "/admin/organizations",
          icon: FolderIcon,
          current: false,
        },
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
        {
          name: "Invoices",
          href: "/admin/invoices",
          icon: DocumentTextIcon,
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
  ];

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
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-main px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-24 w-auto"
                        src="/assets/img/logo.png"
                        alt="Your Company"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <Navigation
                          setSidebarOpen={setSidebarOpen}
                          navigation={adminNavigation}
                        />
                        <li className="mt-auto">
                          <Link
                            onClick={() => setSidebarOpen(false)}
                            to="/admin/settings"
                            className="bg-main group flex gap-x-3 rounded-md p-2  text-primary"
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
        <div className="hidden bg-main lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col ">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200   px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-24 w-auto"
                src="/assets/img/logo.png"
                alt="Your Company"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <Navigation
                  setSidebarOpen={setSidebarOpen}
                  navigation={adminNavigation}
                />

                <li className="mt-auto">
                  <Link
                    onClick={() => setSidebarOpen(false)}
                    to="/admin/settings"
                    className="group -mx-2 flex gap-x-3 bg-main rounded-md p-2 text-sm font-semibold leading-6 text-primary text-primary-hover"
                  >
                    <Cog6ToothIcon
                      className="h-6 w-6 shrink-0 "
                      aria-hidden="true"
                    />
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72 h-screen overflow-y-auto relative bg-main">
          <SuperAdminHeader setSidebarOpen={setSidebarOpen} />

          <main className="py-3  ">
            <div className="mx-auto    px-4  ">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

import { dark } from "@clerk/themes";
import useDarkTheme from "../../utils/hooks/useDarkTheme";
const SuperAdminHeader = ({
  setSidebarOpen,
}: {
  setSidebarOpen: (state: boolean) => void;
}) => {
  const { daktThemeSelector, isDarkTheme } = useDarkTheme();
  return (
    <div className="sticky   top-0 z-40 lg:mx-auto ">
      <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-main text-primary px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
        <button
          type="button"
          className="-m-2.5 p-2.5  lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="relative p-4  flex flex-1">
            <OrganizationSwitcher
              appearance={{
                baseTheme: isDarkTheme ? dark : undefined,
              }}
              afterSelectPersonalUrl={"/home"}
              afterLeaveOrganizationUrl={"/home"}
            />
          </div>
          <div className="flex items-center gap-x-2  ">
            {daktThemeSelector}

            <Link
              to={"/admin/notifications"}
              className="-m-2.5 mr-1 p-2.5 text-primary"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </Link>

            {/* Separator */}
            <div
              className="hidden mr-3 lg:block lg:h-6 lg:w-px lg:bg-gray-200"
              aria-hidden="true"
            />

            {/* Profile dropdown */}
            <div className="pr-7">
              <UserButton
                appearance={{
                  baseTheme: isDarkTheme ? dark : undefined,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
