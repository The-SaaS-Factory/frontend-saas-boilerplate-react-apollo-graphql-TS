import { UserGroupIcon } from "@heroicons/react/16/solid";
import PageName from "../../../ui/commons/PageName";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import { useState } from "react";
import SuperAdminBillingSettingPage from "./SuperAdminBillingSettingPage";
import SuperAdminSettingsGeneral from "./SuperAdminSettingsGeneral";
import { systemScope } from "@/utils/constants/globalContants";
import {
  OrganizationList,
  OrganizationProfile,
  useOrganization,
} from "@clerk/clerk-react";
import useDarkTheme from "@/utils/hooks/useDarkTheme";
import { dark } from "@clerk/themes";

const SuperAdminSettingPage = () => {
  const { isDarkTheme } = useDarkTheme();
  const [tabSelected, setTabSelected] = useState(0);
  const { organization } = useOrganization();

  return (
    <div>
      <PageName
        name="Settings"
        breadcrumbs={[
          {
            name: "Home",
            href: "/home/dashboard",
          },
          {
            name: "Settings",
            href: "/home/settings",
          },
        ]}
      />
      <TabGroup>
        <TabList className="mt-1 flex flex-wrap">
          <Tab
            className={
              tabSelected === 0
                ? "text-primary  border-b-2 border-primary"
                : "text-secundary"
            }
            icon={UserGroupIcon}
            onClick={() => setTabSelected(0)}
          >
            General
          </Tab>
          <Tab
            className={
              tabSelected === 1
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }
            icon={UserGroupIcon}
            onClick={() => setTabSelected(1)}
          >
            Itengrations
          </Tab>
          <Tab
            className={
              tabSelected === 2
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }
            icon={UserGroupIcon}
            onClick={() => setTabSelected(2)}
          >
            Billing
          </Tab>
          <div>
            {systemScope === "organization" && (
              <Tab
                className={
                  tabSelected === 3
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500"
                }
                icon={UserGroupIcon}
                onClick={() => setTabSelected(3)}
              >
                Organization
              </Tab>
            )}
          </div>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="mt-1">
              <SuperAdminSettingsGeneral />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-1">
              <div className="  w-full"></div>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-1">
              <SuperAdminBillingSettingPage />
            </div>
          </TabPanel>
          {systemScope === "organization" && (
            <TabPanel>
              <div className="mt-1">
                <div className="  w-full">
                  {organization ? (
                    <OrganizationProfile
                      appearance={{
                        baseTheme: isDarkTheme ? dark : undefined,
                        elements: { card: "shadow-none" },
                      }}
                    />
                  ) : (
                    <OrganizationList
                      appearance={{
                        baseTheme: isDarkTheme ? dark : undefined,
                        elements: { card: "shadow-none" },
                      }}
                    />
                  )}
                </div>
              </div>
            </TabPanel>
          )}
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default SuperAdminSettingPage;
