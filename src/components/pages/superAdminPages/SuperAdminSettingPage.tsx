import { UserGroupIcon } from "@heroicons/react/16/solid";
import PageName from "../../ui/commons/PageName";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import { useState } from "react";

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
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="mt-1"></div>
          </TabPanel>
          <TabPanel>
            <div className="mt-1">
              <div className="  w-full"></div>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default SuperAdminSettingPage;
