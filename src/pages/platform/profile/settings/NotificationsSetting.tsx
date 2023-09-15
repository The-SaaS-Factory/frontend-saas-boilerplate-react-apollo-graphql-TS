import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { Switch } from "@headlessui/react";
import {
  GET_CURRENT_USER,
  SAVE_SETTING_FOR_USER,
} from "../../../../utils/queries";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const NotificationsSetting = () => {
  const { t, i18n } = useTranslation("settings");
  const { data: user, refetch } = useQuery(GET_CURRENT_USER);
  const [newTournamentNotification, setnewTournamentNotification] =
    useState(false);
  const [newMessagesNotification, setnewMessagesNotification] = useState(false);
  const [newPlatformNotification, setNewPlatformNotification] = useState(false);

  const [updateSetting, { loading: loadingSetting, error: errorUpdate }] =
    useMutation(SAVE_SETTING_FOR_USER, {
      onCompleted(data) {
        if (data.saveSetting.settingName == "newMessagesNotification") {
          setnewMessagesNotification(!newMessagesNotification);
        }
        if (data.saveSetting.settingName == "newTournamentNotification") {
          setnewTournamentNotification(!newTournamentNotification);
        }

        if (data.saveSetting.settingName == "newPlatformNotification") {
          setNewPlatformNotification(!newPlatformNotification);
        }

        toast.success(t("updated_setting"));
      },
      onError(error) {
        console.log(error);

        toast.error(error.message);
      },
    });

  useEffect(() => {
    const newPlatformNotification = user?.me?.UserSetting?.find(
      (setting: any) => setting.settingName === "newPlatformNotification"
    );
    if (newPlatformNotification) {
      setNewPlatformNotification(
        newPlatformNotification.settingValue === "1" ? true : false
      );
    } else {
      setNewPlatformNotification(false);
    }
  }, [user]);

  const handleSetting = (settingValue: any, settingName: string) => {
    const payload = {
      settingName: settingName,
      settingValue: settingValue,
    };
    updateSetting({ variables: payload });
  };

  return (
    <div>
      <div className="pb-16">
        <div className="px-4 sm:px-6 md:px-0">
          <div className="py-2">
            <div className="mt-1 divide-y divide-gray-200">
              <div className="space-y-1   ">
                <div className="flex flex-col">
                  <h3 className="text-lg font-medium leading-6 subtitle">
                    {t("platform")}
                  </h3>

                  <div className="relative  flex py-4">
                    <div className="min-w-0 flex-1 text-sm leading-6">
                      <label className="select-none font-medium text">
                        {t("new_platform_notification")}
                      </label>
                    </div>
                    <Switch
                      checked={newPlatformNotification}
                      onChange={(value: any) => {
                        handleSetting(
                          value ? "1" : "0",
                          "newPlatformNotification"
                        );
                      }}
                      className={classNames(
                        newPlatformNotification
                          ? "bg-indigo-600"
                          : "bg-gray-200",
                        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                      )}
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        className={classNames(
                          newPlatformNotification
                            ? "translate-x-5"
                            : "translate-x-0",
                          "pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                        )}
                      >
                        <span
                          className={classNames(
                            newPlatformNotification
                              ? "opacity-0 duration-100 ease-out"
                              : "opacity-100 duration-200 ease-in",
                            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                          )}
                          aria-hidden="true"
                        >
                          <svg
                            className="h-3 w-3 text-gray-400"
                            fill="none"
                            viewBox="0 0 12 12"
                          >
                            <path
                              d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <span
                          className={classNames(
                            newPlatformNotification
                              ? "opacity-100 duration-200 ease-in"
                              : "opacity-0 duration-100 ease-out",
                            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                          )}
                          aria-hidden="true"
                        >
                          <svg
                            className="h-3 w-3 text-indigo-600"
                            fill="currentColor"
                            viewBox="0 0 12 12"
                          >
                            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                          </svg>
                        </span>
                      </span>
                    </Switch>
                  </div>
 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSetting;
