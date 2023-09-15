import { useState } from "react";
import { BookOpenIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import { CreditCardIcon, GlobeAltIcon } from "@heroicons/react/20/solid";
import PageName from "../../../components/commons/PageName";
import {
  Card,
  TabList,
  Tab,
  TabGroup,
  TabPanels,
  TabPanel,
} from "@tremor/react";
import SuperAdminSettingsGeneral from "./parts/SuperAdminSettingsGeneral";
import SuperAdminSettingsInvoicing from "./parts/SuperAdminSettingsInvoicing";
import SuperAdminSettingsIntegrations from "./parts/SuperAdminSettingsIntegrations";
import SuperAdminSettingsLanguages from "./parts/SuperAdminSettingsLanguages";
import { useTranslation } from "react-i18next";

const SuperAdminSettingsPage = () => {
  const [tabSelected, setTabSelected] = useState(0);
  const { t } = useTranslation("superadmin");
  const handleClickTab = (index: number) => {
    setTabSelected(index);
  };

  return (
    <div>
      <PageName
        name="Settings"
        breadcrumbs={[
          { name: "Dashboard", href: "/admin" },
          { name: "Settings", href: "#" },
        ]}
      />
      <>
        <Card>
          <TabGroup onIndexChange={handleClickTab} defaultIndex={tabSelected}>
            <TabList className="flex flex-wrap">
              <Tab
                className={`${tabSelected === 0 && "text-primary"}`}
                color="default"
                icon={GlobeAltIcon}
              >
            <span className="text">    {t("general")}</span>
              </Tab>
              <Tab
                className={`${tabSelected === 1 && "text-primary"}`}
                color="default"
                icon={CodeBracketIcon}
              >
               <span className="text">  {t("integrations")}</span>
              </Tab>
              <Tab
                className={`${tabSelected === 2 && "text-primary"}`}
                icon={CreditCardIcon}
              >
                {" "}
                <span className="text">   {t("billing")}{" "}</span>
              </Tab>
              <Tab
                className={`${tabSelected === 3 && "text-primary"}`}
                icon={BookOpenIcon}
              >
                {" "}
                <span className="text">   {t("language")}{" "}</span>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div className="mt-10">
                  <SuperAdminSettingsGeneral />
                </div>
              </TabPanel>
              <TabPanel>
                <div className="mt-10">
                  <SuperAdminSettingsIntegrations />
                </div>
              </TabPanel>
              <TabPanel>
                <div className="mt-10">
                  <SuperAdminSettingsInvoicing />
                </div>
              </TabPanel>
              <TabPanel>
                <div className="mt-10">
                  <SuperAdminSettingsLanguages />
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Card>
      </>
    </div>
  );
};

export default SuperAdminSettingsPage;
