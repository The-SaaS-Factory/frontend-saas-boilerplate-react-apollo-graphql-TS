import { Squares2X2Icon } from "@heroicons/react/24/outline";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import { useState } from "react";
import SuperAdminACLModulesPage from "./parts/SuperAdminACLModulesPage";
import SuperAdminACLOrganizationsPage from "./parts/SuperAdminACLOrganizationsPage";

const SuperAdminACLSettingsPage = () => {
  const [tabSelected, setTabSelected] = useState(0);

  return (
    <div>
      <TabGroup>
        <TabList className="mt-1 flex flex-wrap ">
          <Tab
            className={
              tabSelected === 0
                ? "text-primary  border-b-2 border-primary"
                : "text-secundary"
            }
            icon={Squares2X2Icon}
            onClick={() => setTabSelected(0)}
          >
            <span className="text-primary">Modules</span>
          </Tab>
          <Tab
            className={
              tabSelected === 1
                ? "text-primary  border-b-2 border-primary"
                : "text-secundary"
            }
            icon={Squares2X2Icon}
            onClick={() => setTabSelected(1)}
          >
            <span className="text-primary">Organizations</span>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <div className="mt-1">
              <SuperAdminACLModulesPage />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-1">
              <SuperAdminACLOrganizationsPage />
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default SuperAdminACLSettingsPage;
