import { useState } from "react";
import PageName from "../../../components/commons/PageName";
import {
  Card,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@tremor/react";
import { QueueListIcon } from "@heroicons/react/24/outline";
import { GET_FRONTEND_COMPONENTS } from "../../../utils/queries";
import SuperAdminFrontendComponents from "./parts/SuperAdminFrontendComponents";
import SuperAdminFrontendNewComponent from "./parts/SuperAdminFrontendNewComponent";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

const SuperAdminFrontendSettingsPage = () => {
  const [tabSelected, setTabSelected] = useState(0);
  const { t } = useTranslation("superadmin");
  const handleClickTab = (index: number) => {
    setTabSelected(index);
  };

  const { data: components, refetch } = useQuery(GET_FRONTEND_COMPONENTS);

  return (
    <div>
      <PageName
        name={t("frontend_setting")}
        breadcrumbs={[
          { name: t("dashboard"), href: "/admin" },
          { name: t("frontend_setting"), href: "#" },
        ]}
      />
      <Card>
        <TabGroup onIndexChange={handleClickTab} defaultIndex={tabSelected}>
          <TabList>
            <Tab
              className={`${tabSelected === 0 && "text-primary"}`}
              color="default"
              icon={QueueListIcon}
            >
            <span className="text">{t("components")}</span>  
            </Tab>
            <Tab
              className={`${tabSelected === 1 && "text-primary"}`}
              color="default"
              icon={QueueListIcon}
            >
              <span className="text">  {t("new_component")} </span>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SuperAdminFrontendComponents
                components={components}
                refetch={refetch}
              />
            </TabPanel>
            <TabPanel>
              <SuperAdminFrontendNewComponent refetch={refetch} />
            </TabPanel>
            <TabPanel></TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  );
};

export default SuperAdminFrontendSettingsPage;
