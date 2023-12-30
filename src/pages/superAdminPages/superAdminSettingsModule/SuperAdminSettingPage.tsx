import { UserGroupIcon } from "@heroicons/react/16/solid";
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
import SuperAdminSettingsIntegrations from "./SuperAdminSettingsIntegrations";
import SuperAdminMarketingSettingGeneral from "./SuperAdminMarketingSettingGeneral";
import {
  AdjustmentsHorizontalIcon,
  CodeBracketIcon,
  CreditCardIcon,
  FaceSmileIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import PageName from "@/components/ui/commons/PageName";
import SuperAdminACLSettingsPage from "./SuperAdminACLSettingsPage";

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
        <TabList className="mt-1 flex flex-wrap ">
          <Tab
            className={
              tabSelected === 0
                ? "text-primary  border-b-2 border-primary"
                : "text-secundary"
            }
            icon={AdjustmentsHorizontalIcon}
            onClick={() => setTabSelected(0)}
          >
            <span className="text-primary">General</span>
          </Tab>
          <Tab
            className={
              tabSelected === 1
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }
            icon={CodeBracketIcon}
            onClick={() => setTabSelected(1)}
          >
            <span className="text-primary">Itengrations</span>
          </Tab>
          <Tab
            className={
              tabSelected === 2
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }
            icon={FaceSmileIcon}
            onClick={() => setTabSelected(2)}
          >
            <span className="text-primary"> Marketing</span>
          </Tab>
          <Tab
            className={
              tabSelected === 3
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }
            icon={CreditCardIcon}
            onClick={() => setTabSelected(3)}
          >
            <span className="text-primary"> Billing</span>
          </Tab>
          <Tab
            className={
              tabSelected === 4
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }
            icon={LockClosedIcon}
            onClick={() => setTabSelected(4)}
          >
            <span className="text-primary"> Security</span>
          </Tab>
          <div>
            {systemScope === "organization" && (
              <Tab
                className={
                  tabSelected === 5
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500"
                }
                icon={UserGroupIcon}
                onClick={() => setTabSelected(5)}
              >
                <span className="text-primary"> Organization</span>
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
              <div className="  w-full">
                <SuperAdminSettingsIntegrations />
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-1">
              <div className="  w-full">
                <SuperAdminMarketingSettingGeneral />
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-1">
              <SuperAdminBillingSettingPage />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-1">
              <SuperAdminACLSettingsPage />
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
