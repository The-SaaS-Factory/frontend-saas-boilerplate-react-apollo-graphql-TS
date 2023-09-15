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
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PageName from "../../../../components/commons/PageName";
import SuperAdminDownloadListPage from "./SuperAdminDownloadListPage";
const SuperAdminDownloadPage = () => {
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
        name={t("downloads")}
        breadcrumbs={[
          { name: t("dashboard"), href: "/admin" },
          { name: t("manage_downloads"), href: "#" },
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
             <span className="text">{t("resources")}</span> 
            </Tab>
             
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className="mt-10">
                 <SuperAdminDownloadListPage />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="mt-10">
                
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  );
}

export default SuperAdminDownloadPage