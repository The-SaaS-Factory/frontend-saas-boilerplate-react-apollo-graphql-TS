import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Cog6ToothIcon,
  HomeIcon,
  LifebuoyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";

import { Link, Outlet, useLocation } from "react-router-dom";
import { OrganizationSwitcher, UserButton } from "@clerk/clerk-react";

import { classNames } from "@/utils/facades/strFacade";
import useSuperAdmin from "@/utils/hooks/useSuperAdmin";
const systemScope = import.meta.env.VITE_SAAS_SYSTEM_SCOPE;

export const AdminNavigation = [
  { name: "Dashboard", href: "/home", icon: HomeIcon, current: true },
  //{ name: "Team", href: "#", icon: UsersIcon, current: false },
  // { name: "Projects", href: "#", icon: FolderIcon, current: false },
  // { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  //{ name: "Documents", href: "#", icon: DocumentDuplicateIcon, current: false },
  //{ name: "Reports", href: "#", icon: ChartPieIcon, current: false },
];
// const teams = [
//   { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
//   { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
//   { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
// ];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathName = useLocation().pathname;

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
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {AdminNavigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  to={item.href}
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
                        </li>
                        {/* <li>
                          <div className="text-xs font-semibold leading-6 text-gray-400">
                            Your teams
                          </div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {teams.map((team) => (
                              <li key={team.name}>
                                <a
                                  href={team.href}
                                  className={classNames(
                                    team.current
                                      ? "bg-gray-50 text-indigo-600"
                                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <span
                                    className={classNames(
                                      team.current
                                        ? "text-indigo-600 border-indigo-600"
                                        : "text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600",
                                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white"
                                    )}
                                  >
                                    {team.initial}
                                  </span>
                                  <span className="truncate">{team.name}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li> */}
                        <li className="mt-auto">
                          <Link
                            onClick={() => setSidebarOpen(false)}
                            to="/home/support"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                          >
                            <LifebuoyIcon
                              className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                              aria-hidden="true"
                            />
                            Support
                          </Link>
                          <Link
                            onClick={() => setSidebarOpen(false)}
                            to="/home/settings"
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
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-24 pt-1 w-auto"
                src="/assets/img/logo.png"
                alt="Your Company"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {AdminNavigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
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
                </li>
                {/* <li>
                  <div className="text-xs font-semibold leading-6 text-gray-400">
                    Your teams
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <a
                          href={team.href}
                          className={classNames(
                            team.current
                              ? "bg-gray-50 text-indigo-600"
                              : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <span
                            className={classNames(
                              team.current
                                ? "text-indigo-600 border-indigo-600"
                                : "text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600",
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white"
                            )}
                          >
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li> */}
                <li className="mt-auto">
                  <Link
                    onClick={() => setSidebarOpen(false)}
                    to="/home/support"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                  >
                    <LifebuoyIcon
                      className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                      aria-hidden="true"
                    />
                    Support
                  </Link>
                  <Link
                    onClick={() => setSidebarOpen(false)}
                    to="/home/settings"
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
          <AdminHeader setSidebarOpen={setSidebarOpen} />

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

const AdminHeader = ({
  setSidebarOpen,
}: {
  setSidebarOpen: (state: boolean) => void;
}) => {
  const { isSuperAdmin } = useSuperAdmin();

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
              {systemScope === "organization" && <OrganizationSwitcher />}
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {isSuperAdmin && (
                <Link to="/admin" className="btn-main">
                  <span>Admin Panel</span>
                </Link>
              )}
              <Link
                to={"/home/notifications"}
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
