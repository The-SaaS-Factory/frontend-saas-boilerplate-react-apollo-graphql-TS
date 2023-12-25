import { UserGroupIcon } from "@heroicons/react/16/solid";
import PageName from "../../../ui/commons/PageName";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import { useState } from "react";
import SuperAdminBillingSettingPage from "./SuperAdminBillingSettingPage";
import SuperAdminSettingsGeneral from "./SuperAdminSettingsGeneral";
 
const SuperAdminSettingPage = () => {
  const [tabSelected, setTabSelected] = useState(0);

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
        <TabList className="mt-1">
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
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default SuperAdminSettingPage;
