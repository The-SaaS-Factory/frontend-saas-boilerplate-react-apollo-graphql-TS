import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
const SidebarProfile = (props: {
  open: boolean | undefined;
  user: any;
  handleOpen: (state: boolean) => void;
}) => {
  const { t } = useTranslation("superadmin");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const closeSession = (e: any) => {
    e.preventDefault();
    localStorage.removeItem("token");
    dispatch(logout());
    props.handleOpen(false);
    navigate('/');
  //  window.location.href = "/";
  };
  const { token, isSuperAdmin } = useSelector((state: any) => state.auth);
  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={props.handleOpen}>
        <div className="fixed inset-0" />
        <div className="fixed  inset-0  ">
          <div className="absolute inset-0  ">
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
                  <div className="flex max-h-screen h-full flex-col  bg-main pt-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-end">
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white main-color hover:text-gray-500 focus:outline-none focus:outline-none  "
                            onClick={() => props.handleOpen(false)}
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
                    <div className="relative    lg:pt-0    flex-1 px-4 sm:px-6">
                      <div className=" px-4 sm:px-6">
                        <div
                          className="  mx-auto justify-center space-y-3 flex flex-col "
                          aria-hidden="true"
                        >
                          <span className="subtitle px-7 text">
                            {" "}
                            {t("settings")}
                          </span>

                          <Link
                            to={`${
                              isSuperAdmin
                                ? "/admin/profile/settings"
                                : "/home/settings"
                            }`}
                          >
                            <button
                              onClick={() => props.handleOpen(!open)}
                              className="w-full px-7 text-lg color-main flex self-center justify-between text  "
                            >
                              {t("settings_accoutns")}
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
                                  d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"
                                />
                              </svg>
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {props.user?.username && (
                      <div className="flex flex-shrink-0 border-t g-main p-4 py-7">
                        <div className="group block flex-shrink-0">
                          <div className="flex items-center">
                            <div>
                              <img
                                className="inline-block  object-cover object-center h-10 w-10 rounded-full"
                                src={
                                  props.user?.avatar ?? "/assets/img/avatar.png"
                                }
                                alt=""
                              />
                            </div>
                            <div className="ml-3">
                              <p className="text-base font-medium text">
                                {props.user?.username
                                  .toUpperCase()
                                  .slice(0, 10) + " ..."}
                              </p>
                              <button
                                onClick={(e) => closeSession(e)}
                                className="text-sm font-medium text "
                              >
                                {t("sign_off")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SidebarProfile;
