import { useState } from "react";
import PageName from "../../../components/commons/PageName";
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
import { useTranslation } from "react-i18next";

const SuperAdminPlansPage = () => {
  //States
  const [tabSelected, setTabSelected] = useState(0);

  //Funtions and hooks
  const handleClickTab = (index: number) => {
    setTabSelected(index);
  };
  const { t } = useTranslation("superadmin");

  return (
    <div>
      <PageName
        name={t("plans")}
        breadcrumbs={[
          { name: t("dashboard"), href: "/admin" },
          { name: t("manage_plans"), href: "#" },
        ]}
        btn1={{ name: t("add"), icon: PlusCircleIcon, href: "add" }}
      />

      <Card>
        <TabGroup onIndexChange={handleClickTab} defaultIndex={tabSelected}>
          <TabList className="flex flex-wrap">
            <Tab
              className={`${tabSelected === 0 && "text-primary"}`}
              color="default"
              icon={ShoppingBagIcon}
            >
             <span className="text">{t("plans")}</span> 
            </Tab>
            <Tab
              className={`${tabSelected === 1 && "text-primary"}`}
              color="default"
              icon={CpuChipIcon}
            >
              <span className="text">  {t("capabilities")}</span>
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
