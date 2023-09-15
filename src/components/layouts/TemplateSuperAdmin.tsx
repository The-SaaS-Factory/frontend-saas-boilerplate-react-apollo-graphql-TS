import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { useLocation } from "react-router-dom";
import {
  Bars3Icon,
  BellIcon,
  ChevronLeftIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronRightIcon,
  Cog6ToothIcon,
  HomeModernIcon,
  LifebuoyIcon,
  ShoppingBagIcon,
  Square2StackIcon,
  UserPlusIcon,
} from "@heroicons/react/20/solid";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";
import SidebarProfile from "../commons/SidebarProfile";
import { useSelector } from "react-redux";
import { GET_PLATFORM_GENERAL_DATA } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { getSettingValue } from "../../utils/facades/resorceFacade";
import { Helmet } from "react-helmet-async";
import NotificationSubscription from "./NotificationSubscription";
import { useTranslation } from "react-i18next";
import DarkTheme from "../commons/DarkTheme";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TemplateSuperAdmin() {
  const { t } = useTranslation("superadmin");
  const { data: generalData } = useQuery(GET_PLATFORM_GENERAL_DATA);
  const general = generalData?.getPlatformGeneralData ?? [];
  const faviconUrl: string = getSettingValue(general, "PLATFORM_FAVICON");
  const logoUrl: string = getSettingValue(general, "PLATFORM_LOGO");
  const platformName: string = getSettingValue(general, "PLATFORM_NAME");
  const { notificationsUnReaded } = useSelector((state: any) => state.auth);
  const location = useLocation();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navigation = [
    {
      sectionName: "Admin",
      items: [
        {
          name: t("dashboard"),
          href: "/admin",
          icon: HomeModernIcon,
          current: location.pathname === "/admin",
        },
        {
          name: t("users"),
          href: "/admin/users",
          icon: UserPlusIcon,
          current: location.pathname === "/admin/users",
        },
      ],
    },
    {
      sectionName: t("billing"),
      items: [
        {
          name: t("plans"),
          href: "/admin/plans",
          icon: Square2StackIcon,
          current: location.pathname === "/admin/plans",
        },
        {
          name: t("subscriptions"),
          href: "/admin/subscriptions",
          icon: ShoppingBagIcon,
          current: location.pathname === "/admin/subscriptions",
        },
      ],
    },
    {
      sectionName: t("modules"),
      items: [
        {
          name: t("support"),
          href: "/admin/support",
          icon: LifebuoyIcon,
          current: location.pathname === "/admin/support",
        },
      ],
    },
    {
      sectionName: t("settings"),
      items: [
        {
          name: t("general_setting"),
          href: "/admin/settings",
          icon: Cog6ToothIcon,
          current: location.pathname === "/admin/settings",
        },
        {
          name: t("frontend_setting"),
          href: "/admin/frontend/settings",
          icon: Cog6ToothIcon,
          current: location.pathname === "/admin/frontend/settings",
        },
        {
          name: t("marketing_setting"),
          href: "/admin/marketing/settings",
          icon: Cog6ToothIcon,
          current: location.pathname === "/admin/marketing/settings",
        },
      ],
    },
  ];

  //#Fix
  //Sections, Software, Billing, Marketing, Administration
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const handleSidebarProfile = (state: boolean) => {
    setOpen(state);
  };
  const { user, tournamentPoints } = useSelector((state: any) => state.auth);

  return (
    <>
      {" "}
      <NotificationSubscription />
      <Helmet>
        <link rel="icon" type="image/png" href={faviconUrl} />
      </Helmet>
      <div className="bg-main ">
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

                  <div className="flex grow flex-col gap-y-5 overflow-y-auto g-main  px-6 pb-2 ring-1 ring-white/10">
                    <div className="flex   items-center"></div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="-mx-2 flex-1 space-y-1">
                        {Navigation(
                          navigation,
                          isSidebarExpanded,
                          "mobile",
                          setSidebarOpen
                        )}
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div
          className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block ${
            isSidebarExpanded
              ? "lg:w-20 transition-all"
              : "lg:w-60   transition-all"
          } lg:overflow-y-auto g-main lg:pb-4`}
        >
          <div className="flex  h-16 shrink-0 items-center justify-center">
            <Link to={"/"}>
              <img src={logoUrl} className="p-3 max-h-20" alt={platformName} />
            </Link>
          </div>
          <div className="flex justify-end">
            {!isSidebarExpanded ? (
              <button
                className="text justify-end  "
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              >
                <ChevronLeftIcon className="h-7" />
              </button>
            ) : (
              <button
                className="text rounded-2xl  justify-end  "
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              >
                <ChevronRightIcon className="h-7" />
              </button>
            )}
          </div>
          <nav className="mt-1">
            {Navigation(
              navigation,
              isSidebarExpanded,
              "desktop",
              setSidebarOpen
            )}
          </nav>
        </div>

        <div
          className={` ${
            isSidebarExpanded
              ? "lg:pl-20 transition-all"
              : "lg:pl-60 transition-all"
          } `}
        >
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4    bg-main px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div
              className="h-6 w-px bg-gray-900/10 lg:hidden"
              aria-hidden="true"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="relative items-center flex flex-1">
                <h2 className="subtitle">{platformName}</h2>
              </div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <DarkTheme />
                <Link
                  to={"/admin/notifications"}
                  type="button"
                  className="-m-2.5 p-2.5 text relative"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                  {notificationsUnReaded > 0 && (
                    <span className="absolute -top-1 right-0 badge-red text-sm">
                      {notificationsUnReaded}
                    </span>
                  )}
                </Link>

                {/* Separator */}
                <div
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                  aria-hidden="true"
                />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <button
                    className="  -m-2.5 p-2.5  "
                    aria-label="Open Menu"
                    onClick={() => setOpen(!open)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="icon text mt-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                </Menu>
              </div>
            </div>
          </div>

          <main className="xl:pr-[20%] bg-main min-h-screen">
            <div id="main" className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6 ">
              <Outlet />
            </div>
          </main>
        </div>

        <aside className="fixed bottom-0 right-20 top-16 hidden bg-main w-46 overflow-y-auto border-l border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">
          <span className="text">{t("not_tip_available")} </span>
        </aside>
      </div>
      <SidebarProfile
        user={user}
        open={open}
        handleOpen={handleSidebarProfile}
      />
    </>
  );
}

const Navigation = (navigation, isSidebarExpanded, display, setSidebarOpen) => {
  return navigation.map((section) => (
    <div key={section.sectionName} className="mb-1 p-3">
      {!isSidebarExpanded ||
        (display === "mobile" && (
          <h3 className="text  pb-2 px-3">{section.sectionName}</h3>
        ))}
      <ul
        role="list"
        className={`flex flex-col ${
          !isSidebarExpanded || display === "mobile"
            ? "justify-start transition-all   delay-1000"
            : "items-center transition-all "
        }  `}
      >
        <span className="text text-sm mb-1">{section.sectionName}</span>
        {section.items.map((item) => (
          <li key={item.name} className="flex group  ">
            <Link
              onClick={() => setSidebarOpen(false)}
              to={item.href}
              className={classNames(
                item.current
                  ? "dark:bg-gray-500 bg-gray-300 text-gray-900 dark:text-gray-200"
                  : "text hover:text-gray-800 hover:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-700",
                "group flex gap-x-3 rounded-md p-1.5 px-3 my-0.5  text-sm leading-6 font-semibold"
              )}
            >
              <item.icon
                className="h-6 w-6 shrink-0 group-hover:rotate-12"
                aria-hidden="true"
              />
              <span className="sr-only">{item.name}</span>
              <span
                className={`${
                  !isSidebarExpanded || display === "mobile"
                    ? "flex text    transition-all "
                    : "hidden transition-all "
                } text-sm `}
              >
                {item.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  ));
};
