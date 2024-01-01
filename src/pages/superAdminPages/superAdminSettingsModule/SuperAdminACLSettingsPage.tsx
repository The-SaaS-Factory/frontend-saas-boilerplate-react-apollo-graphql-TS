import { Squares2X2Icon } from "@heroicons/react/24/outline";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import { useState } from "react";
import SuperAdminACLModulesPage from "./parts/SuperAdminACLModulesPage";
import SuperAdminACLOrganizationsPage from "./parts/SuperAdminACLOrganizationsPage";

const SuperAdminACLSettingsPage = () => {
  const [tabSelected, setTabSelected] = useState(0);

  return (
    <div>
      <div className="flex flex-col space-y-3 lg:w-1/2 mb-7">
        <h1 className="text-2xl font-semibold text-primary">
          Security Settings
        </h1>
        
        <p className="text-primary">
          Configure permissions for organizations on the platform. You can add
          permissions to these by adding them to the scope of each module or
          directly adding permissions from different modules to create specific
          roles. Then only the admin of each organization will have to add new
          members and they will lose the permissions of their organizations.
        </p>
      </div>
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
