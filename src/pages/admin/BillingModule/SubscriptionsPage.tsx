import React, { useState } from "react";
import PageName from "../../../components/commons/PageName";
import { Button, Flex } from "@tremor/react";
import {
  Card,
  TabGroup,
  TabList,
  Tab,
  Text,
  TabPanels,
  TabPanel,
} from "@tremor/react";
import {
  BuildingLibraryIcon,
  ClipboardDocumentCheckIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import AdminInvoices from "./AdminInvoices";
import { useParams } from "react-router-dom";
import AdminPlanActive from "./AdminPlanActive";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { useTranslation } from "react-i18next";

const SubscriptionsPage = () => {
  const { t } = useTranslation("admin");
  const [tabSelected, setTabSelected] = useState(0);
  const { paymentCompleted } = useParams();

  const handleClickTab = (index: number) => {
    setTabSelected(index);
  };
  const { width, height } = useWindowSize();
  return (
    <div>
      {paymentCompleted && (
        <Confetti
          width={width - 50}
          height={height - 50}
          numberOfPieces={277}
          recycle={false}
        />
      )}
      <PageName
        name={t("billing")}
        breadcrumbs={[
          { name: t("dashboard"), href: "/home" },
          { name: t("billing"), href: "#" },
        ]}
      />
      <>
        <Card>
          <TabGroup onIndexChange={handleClickTab} defaultIndex={tabSelected}>
            <TabList>
              <Tab
                className={`${tabSelected === 0 && "text-primary"}`}
                color="default"
                icon={CreditCardIcon}
              >
                {t("subscriptions")}
              </Tab>
              <Tab
                className={`${tabSelected === 1 && "text-primary"}`}
                icon={ClipboardDocumentCheckIcon}
              >
                {t("invoices")}
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div className="mt-10">
                  <AdminPlanActive />
                </div>
              </TabPanel>
              <TabPanel>
                <div className="mt-10">
                  <AdminInvoices />
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Card>
      </>
    </div>
  );
};

export default SubscriptionsPage;
