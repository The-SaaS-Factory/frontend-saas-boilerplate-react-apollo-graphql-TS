import { useState } from "react";
import {
  Card,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@tremor/react";
import {
  InformationCircleIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/outline";
import PageName from "../../../../components/commons/PageName";
import SuperAdminSupportTicketsListPage from "./tickets/SuperAdminSupportTicketsListPage";
import SuperAdminSupportKnowledgePage from "./knowledge/SuperAdminSupportKnowledgePage";
import { useTranslation } from "react-i18next";
const SuperAdminSupportPage = () => {
  //States
  const [tabSelected, setTabSelected] = useState(0);

  //Funtions and hooks
  const { t } = useTranslation("superadmin");
  const handleClickTab = (index: number) => {
    setTabSelected(index);
  };

  return (
    <div>
      <PageName
        name={t("dashboard")}
        breadcrumbs={[
          { name: t("tickets"), href: "/admin" },
          { name: t("support"), href: "#" },
        ]}
      />
      <Card>
        <TabGroup onIndexChange={handleClickTab} defaultIndex={tabSelected}>
          <TabList>
            <Tab
              className={`${tabSelected === 0 && "text-primary"}`}
              color="default"
              icon={LifebuoyIcon}
            >
             <span className="text">  {t("tickets")}</span> 
            </Tab>
            <Tab
              className={`${tabSelected === 1 && "text-primary"}`}
              icon={InformationCircleIcon}
            >
             <span className="text">{t("knowledge_base")}</span> 
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className="mt-10">
                <SuperAdminSupportTicketsListPage />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="mt-10">
                <SuperAdminSupportKnowledgePage />
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  );
};

export default SuperAdminSupportPage;
