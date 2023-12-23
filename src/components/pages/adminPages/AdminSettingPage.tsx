import { UserGroupIcon } from "@heroicons/react/16/solid";
import PageName from "../../ui/commons/PageName";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import { useState } from "react";
import {
  OrganizationList,
  OrganizationProfile,
  UserProfile,
  useOrganization,
} from "@clerk/clerk-react";
import AdminBillingPage from "./AdminBillingPage";

const AdminSettingPage = () => {
  const [tabSelected, setTabSelected] = useState(0);
  const { organization, membership } = useOrganization();

  console.log(membership);

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
            Perfil
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
            Organization
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
            Plans and Billing
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="mt-1">
              <UserProfile
                appearance={{
                  baseTheme: undefined,
                  elements: { card: "shadow-none" },
                }}
              />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-1">
              <div className="  w-full">
                {organization ? (
                  <OrganizationProfile
                    appearance={{
                      baseTheme: undefined,
                      elements: { card: "shadow-none" },
                    }}
                  />
                ) : (
                  <OrganizationList />
                )}
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-1">
              <div className="  w-full">
                 <AdminBillingPage />
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

 
export default AdminSettingPage;
