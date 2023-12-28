/* eslint-disable react-hooks/exhaustive-deps */
import { UserGroupIcon } from "@heroicons/react/16/solid";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import { useEffect, useState } from "react";
import {
  OrganizationList,
  OrganizationProfile,
  UserProfile,
  useOrganization,
} from "@clerk/clerk-react";
import AdminBillingPage from "./billingModule/AdminBillingPage";
import { systemScope } from "@/utils/constants/globalContants";
import PageName from "@/components/ui/commons/PageName";
import { toast } from "sonner";
import useDarkTheme from "@/utils/hooks/useDarkTheme";
import { dark } from "@clerk/themes";

const AdminSettingPage = () => {
  const { isDarkTheme } = useDarkTheme();
  const [tabSelected, setTabSelected] = useState(0);
  const { organization } = useOrganization();

  //Get status payment
  const urlParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    if (!urlParams.get("paymentStatus")) return;
    if (urlParams.get("paymentStatus") === "success") {
      toast.success("Payment Success");
      setTabSelected(0);
    } else {
      toast.error("Payment Error");
    }
    window.history.replaceState({}, document.title, "/home/settings");
  }, [urlParams]);
 
  return (
    <div>
      <PageName
        name="Settings"
        breadcrumbs={[
          {
            name: "Home",
            href: "/home",
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
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }
            icon={UserGroupIcon}
            onClick={() => setTabSelected(0)}
          >
            Plans and Billing
          </Tab>
          <Tab
            className={
              tabSelected === 1
                ? "text-primary  border-b-2 border-primary"
                : "text-secundary"
            }
            icon={UserGroupIcon}
            onClick={() => setTabSelected(1)}
          >
            Perfil
          </Tab>

          <div>
            {systemScope === "organization" && (
              <Tab
                className={
                  tabSelected === 2
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500"
                }
                icon={UserGroupIcon}
                onClick={() => setTabSelected(2)}
              >
                Organization
              </Tab>
            )}
          </div>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="mt-1">
              <div className="  w-full">
                {!organization && systemScope === "organization" ? (
                  <div className="flex flex-col items-center justify-center">
                    <h1 className="text-title my-14">
                      You need to select or create an organization first
                    </h1>
                    <OrganizationList
                      appearance={{
                        baseTheme: isDarkTheme ? dark : undefined,
                        elements: { card: "shadow-none" },
                      }}
                      afterSelectPersonalUrl={"/home"}
                    />
                  </div>
                ) : (
                  <AdminBillingPage />
                )}
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="mt-1">
              <UserProfile
                appearance={{
                  baseTheme: isDarkTheme ? dark : undefined,
                  elements: { card: "shadow-none" },
                }}
              />
            </div>
          </TabPanel>
          {systemScope === "organization" && (
            <TabPanel>
              <div className="mt-1">
                <div className="  w-full">
                  {organization ? (
                    <OrganizationProfile
                      appearance={{
                        baseTheme: isDarkTheme ? dark : undefined,
                        elements: { card: "shadow-none" },
                      }}
                    />
                  ) : (
                    <OrganizationList
                      appearance={{
                        baseTheme: isDarkTheme ? dark : undefined,
                        elements: { card: "shadow-none" },
                      }}
                      afterSelectPersonalUrl={"/home"}
                    />
                  )}
                </div>
              </div>
            </TabPanel>
          )}
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default AdminSettingPage;
