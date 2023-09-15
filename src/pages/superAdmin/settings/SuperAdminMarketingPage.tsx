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
import { CursorArrowRaysIcon, GiftIcon } from "@heroicons/react/24/outline";

import SuperAdminMarketingSettingGeneral from "./parts/SuperAdminMarketingSettingGeneral";
import SuperAdminMarketingSettingCupons from "./parts/SuperAdminMarketingSettingCupons";
import SuperAdminMarketingSettingEmail from "./parts/SuperAdminMarketingSettingEmail";
import { useTranslation } from "react-i18next";

const SuperAdminMarketingPage = () => {
  const [tabSelected, setTabSelected] = useState(2);
  const { t } = useTranslation("superadmin");
  const handleClickTab = (index: number) => {
    setTabSelected(index);
  };

  return (
    <div>
      <PageName
        name={t('marketing_setting')}
        breadcrumbs={[
          { name: t('dashboard'), href: "/admin" },
          { name: t('marketing_setting'), href: "#" },
        ]}
      />
      <Card>
        <TabGroup onIndexChange={handleClickTab} defaultIndex={tabSelected}>
          <TabList>
            <Tab
              className={`${tabSelected === 0 && "text-primary"}`}
              color="default"
              icon={CursorArrowRaysIcon}
            >
              {t("general")}
            </Tab>
            <Tab
              className={`${tabSelected === 1 && "text-primary"}`}
              color="default"
              icon={GiftIcon}
            >
              {t("coupons")}
            </Tab>
            <Tab
              className={`${tabSelected === 2 && "text-primary"}`}
              color="default"
              icon={GiftIcon}
            >
              {t("emails")}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SuperAdminMarketingSettingGeneral />
            </TabPanel>
            <TabPanel>
              <SuperAdminMarketingSettingCupons />
            </TabPanel>
            <TabPanel>
              <SuperAdminMarketingSettingEmail />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  );
};

export default SuperAdminMarketingPage;
