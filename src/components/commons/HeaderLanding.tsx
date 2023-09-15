import { useState, Fragment, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux/es/exports";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useTranslation } from "react-i18next";
import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@apollo/client";
import { GET_PLATFORM_GENERAL_DATA } from "../../utils/queries";
import { getSettingValue } from "../../utils/facades/resorceFacade";
import { Helmet } from "react-helmet-async";

const HeaderLanding = () => {
  const { user, token, isSuperAdmin } = useSelector((state: any) => state.auth);
  const [open, setOpen] = useState(false);

  const { t } = useTranslation("misc");
  const dispatch = useDispatch();
  const location = useLocation();

  const closeSession = (e: any) => {
    e.preventDefault();
    localStorage.removeItem("token");
    dispatch(logout());
    setOpen(false);
    window.location.href = "/";
  };

  const navigation = [
    { name: "Features", href: "/#features" },

    { name: "Pricing", href: "/pricing" },
    { name: "Company", href: "/about" },
  ];

  const { data: generalData } = useQuery(GET_PLATFORM_GENERAL_DATA);
  const general = generalData?.getPlatformGeneralData ?? [];
  const logoUrl: string = getSettingValue(general, "PLATFORM_LOGO");
  const faviconUrl: string = getSettingValue(general, "PLATFORM_FAVICON");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Función para manejar el scroll
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Agregar el evento de scroll al montar el componente
    window.addEventListener("scroll", handleScroll);

    // Limpiar el evento al desmontar el componente
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Helmet>
        <link rel="icon" type="image/png" href={faviconUrl} />
      </Helmet>
      <div className="fixed header  z-50 px-5   top-0 grid h-16 w-full grid-cols-4 items-center justify-around bg-tranparent bg-blend-color-burn   py-3">
        <div className="col-span-1  lg:mx-auto  pb-3  ">
          <Link className="flex items-start" to={"/"}>
            <img
              src={logoUrl}
              className="w-auto h-10 -mt-2 "
              alt="The SaaS Factory"
            />
          </Link>
        </div>
        <div className="col-span-2  hidden lg:flex space-x-24 mx-auto pb-3  ">
          <nav
            className="flex items-center justify-between   lg:px-8"
            aria-label="Global"
          >
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  {item.name}
                </Link>
              ))}
              <a
                target="_blank"
                className="text-sm font-semibold leading-6 text-gray-900"
                href="https://thesaasfactory.notion.site/2097bbb5a3bb428aab9686b63c3848bc?v=4d598b1b9773400c93a6cecb1824a095"
              >
                Doc
              </a>
            </div>
          </nav>
        </div>

        <div className="col-span-1 col-start-4 flex space-x-7 justify-end lg:justify-center  pb-4  ">
          {token ? (
         <Link  to={`${
          isSuperAdmin
            ? "/admin"
            : "/home"
        }`} className="btn-main">
          Dashboard
        </Link>
          ) : (
            <Link to={"/auth/login/login"} className="btn-main">
              Login
            </Link>
          )}
          <button aria-label="Open Menu" onClick={() => setOpen(!open)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <div className="fixed inset-0" />
          <div className="fixed  inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex max-h-screen h-full flex-col overflow-y-scroll bg-white pt-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-end">
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-white main-color hover:text-gray-500 focus:outline-none focus:outline-none  "
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6 main-color"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative  pt-20 lg:pt-0 lg:mt-24 flex-1 px-4 sm:px-6">
                        <div className=" px-4 sm:px-6">
                          <div
                            className="  mx-auto justify-center space-y-3 flex flex-col "
                            aria-hidden="true"
                          >
                            {navigation.map((item) => (
                              <Link
                                key={item.name}
                                to={item.href}
                                className="text-lg font-semibold leading-6 text-gray-900"
                              >
                                <button
                                  onClick={() => setOpen(!open)}
                                  className="w-full  px-7 text-base color-main flex self-center justify-between  "
                                >
                                  {item.name}
                                  <div className="icon">
                                    <ArrowRightIcon />
                                  </div>
                                </button>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default HeaderLanding;
