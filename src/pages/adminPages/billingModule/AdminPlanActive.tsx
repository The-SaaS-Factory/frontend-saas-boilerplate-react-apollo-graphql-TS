/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";

import {
  GET_ORGANIZATION_CAPABILITIES,
  GET_PLAN_BY_NAME,
  GET_USER_CAPABILITIES,
} from "../../superAdminPages/plansModule/plansGraphql";
import { useOrganization, useUser } from "@clerk/clerk-react";
import { Card, Flex, ProgressBar, Text } from "@tremor/react";
import CheckBadgeIcon from "@heroicons/react/24/outline/esm/CheckBadgeIcon";
import XMarkIcon from "@heroicons/react/24/outline/esm/XMarkIcon";
import SkeletonTable from "@/components/ui/loaders/SkeltonTable";

const AdminPlanActive = () => {
  //Constant
  const [capacitiesUsed, setCapacitiesUsed] = React.useState<any>([]);
  const [planCapabilities, setPlanCapabilities] = React.useState<any>([]);
  //Hooks
  const { organization } = useOrganization();
  const { user } = useUser();
  //Queries
  const [getPlan, { loading: loadingPlan }] = useLazyQuery(GET_PLAN_BY_NAME);
  const [getUserCapabilities, { loading: loadingUserCapacities }] =
    useLazyQuery(GET_USER_CAPABILITIES);
  const [getOrganizationCapabilities] = useLazyQuery(
    GET_ORGANIZATION_CAPABILITIES
  );

  useEffect(() => {
    if (organization) {
      getPlan({
        variables: {
          name: organization.publicMetadata.membershipPlan ?? "",
        },
      }).then(({ data }) => {
        if (data && data.getPlanByName) {
          setPlanCapabilities(data.getPlanByName.PlanCapabilities);
        }
      });

      getOrganizationCapabilities().then(({ data }) => {
        if (data && data.getOrganizationCapabilies) {
          setCapacitiesUsed(data.getOrganizationCapabilies);
        }
      });
    } else if (user) {
      getPlan({
        variables: {
          name: user.publicMetadata.membershipPlan,
        },
      }).then(({ data }) => {
        if (data && data.getPlanByName) {
          setPlanCapabilities(data.getPlanByName.PlanCapabilities);
        }
      });

      getUserCapabilities().then(({ data }) => {
        console.log(data);

        if (data && data.getUserCapabilities) {
          setCapacitiesUsed(data.getUserCapabilities);
        }
      });
    }
  }, [organization, user]);

  if (loadingPlan || loadingUserCapacities) return <SkeletonTable count={10} />;

  return (
    <div>
      <PlanActive
        planCapabilities={planCapabilities}
        usedCapabilities={capacitiesUsed}
      />
    </div>
  );
};

const PlanActive = ({
  planCapabilities,
  usedCapabilities,
}: {
  planCapabilities: any;
  usedCapabilities: any;
}) => {
  const getUserCountCapabilitie = (capabilitieId: number) => {
    const capabilitie = usedCapabilities?.find(
      (c: any) => c.capabilitieId === capabilitieId
    );
    return capabilitie ? capabilitie.count : 0;
  };

  const getPorcent = (userCount: number, planCount: number) => {
    return (userCount * 100) / planCount;
  };

  return (
    <div>
      <Card className="my-7">
        {planCapabilities?.filter((c: any) => c.capabilitie?.type === "LIMIT")
          .length > 0 && (
          <div>
            <h2 className="title">Current usage:</h2>
            <div className="grid mt-10 grid-cols-1 gap-4 lg:grid-cols-3">
              {planCapabilities
                ?.filter((c: any) => c.capabilitie.type === "LIMIT")
                .map((capabilitie: any, index: number) => (
                  <Flex key={`capabilitie-${index}`}>
                    <Card className="max-w-lg mx-auto">
                      <Text>{capabilitie.capabilitie?.name}</Text>
                      <Flex>
                        <Text>
                          {getUserCountCapabilitie(capabilitie.capabilitieId)}
                        </Text>
                        <Text>max {capabilitie.count}</Text>
                      </Flex>
                      <ProgressBar
                        value={getPorcent(
                          getUserCountCapabilitie(capabilitie.capabilitieId),
                          capabilitie.count
                        )}
                        color="sky"
                        className="mt-3"
                      />
                    </Card>
                  </Flex>
                ))}
            </div>
          </div>
        )}
        <hr className="my-7" />
        <div>
          <h2 className="title">Plan features and limits:</h2>
          <ul
            role="list"
            className="divide-y my-3 grid grid-cols-2 lg:grid-cols-1 space-y-3 divide-gray-100"
          >
            {planCapabilities?.map((capa: any, index: number) => (
              <li
                key={`capa-${index}`}
                className="items-center flex space-x-3 p-1"
              >
                {capa.capabilitie.type === "PERMISSION" ? (
                  capa.count == 1 ? (
                    <button className="btn-icon  mr-2">
                      {" "}
                      <CheckBadgeIcon className="text-green-500 h-5 w-5" />
                    </button>
                  ) : (
                    <button className="btn-icon  mr-2">
                      {" "}
                      <XMarkIcon className="text-red-500 h-5 w-5" />
                    </button>
                  )
                ) : (
                  capa.count
                )}{" "}
                {capa.capabilitie.name}{" "}
                {capa.capabilitie.type === "LIMIT" && "/ month"}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
};
export default AdminPlanActive;
