import { useState } from "react";

import {
  CpuChipIcon,
  PlusCircleIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  TabList,
  Tab,
  TabGroup,
  TabPanels,
  TabPanel,
} from "@tremor/react";
import SuperAdminPlansListPage from "./SuperAdminPlansListPage";
import SuperAdminPlansCapabilities from "./SuperAdminPlansCapabilities";
import PageName from "@/components/ui/commons/PageName";
import useSuperAdmin from "@/utils/hooks/useSuperAdmin";
import ForbiddenPage from "@/components/layouts/errors/ForbiddenPage";

const SuperAdminPlansPage = () => {
  const { hasModulePermission } = useSuperAdmin("superAdmin:billing:read");
  //States
  const [tabSelected, setTabSelected] = useState(0);

  //Funtions and hooks
  const handleClickTab = (index: number) => {
    setTabSelected(index);
  };

  if (!hasModulePermission) {
    return (
      <div className="">
        <ForbiddenPage />
      </div>
    );
  }

  return (
    <div>
      <PageName
        name="Manage Plans"
        breadcrumbs={[
          { name: "Dashboard", href: "/admin" },
          { name: "Manage", href: "#" },
        ]}
        btn1={{ name: "Add", icon: PlusCircleIcon, href: "add" }}
      />

      <Card>
        <TabGroup onIndexChange={handleClickTab} defaultIndex={tabSelected}>
          <TabList className="flex flex-wrap">
            <Tab
              className={`${tabSelected === 0 && "text-primary"}`}
              color="default"
              icon={ShoppingBagIcon}
            >
              <span className="text">Plans</span>
            </Tab>
            <Tab
              className={`${tabSelected === 1 && "text-primary"}`}
              color="default"
              icon={CpuChipIcon}
            >
              <span className="text">Capabilities</span>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className="mt-10">
                <SuperAdminPlansListPage />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="mt-10">
                <SuperAdminPlansCapabilities />
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  );
};

export default SuperAdminPlansPage;
