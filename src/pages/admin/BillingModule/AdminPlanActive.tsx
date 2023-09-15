import { useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { GET_CURRENT_USER_FULL } from "../../../utils/queries";
import { Card, Button, Flex, Text, ProgressBar } from "@tremor/react";
import { Link } from "react-router-dom";
import { formatTimestampToDateString } from "../../../utils/facades/strFacade";
import { CheckBadgeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const AdminPlanActive = () => {
  const { data: userDB, refetch } = useQuery(GET_CURRENT_USER_FULL);
  const { t } = useTranslation("admin");
  const membership = userDB?.me?.Membership[0];
  const planCapabilities = membership?.plan?.PlanCapabilities;
  const userCapabilities = userDB?.me?.UserCapabilities;

  useEffect(() => {
    refetch();
  }, []);

  const getUserCountCapabilitie = (capabilitieId) => {
    const capabilitie = userCapabilities?.find(
      (c) => c.capabilitieId === capabilitieId
    );
    return capabilitie ? capabilitie.count : 0;
  };

  const getPorcent = (userCount, planCount) => {
    return (userCount * 100) / planCount;
  };

  return (
    <div>
      <Card>
        <Flex className="flex flex-col space-y-5 lg:flex-row lg:space-y-0">
          <Text>
           {t('current_plan')}: <b>{membership?.plan?.name ?? "-"}</b>
          </Text>
          <Text>
          {t('next_renovation')}:  {" "}
            <b>
              {membership?.endDate &&
                formatTimestampToDateString(membership?.endDate)}
            </b>
          </Text>
          <Link to={"/home/billing/plans"}>
            {!membership ? (
              <Button size="sm"> {t('get_new_plan')}</Button>
            ) : (
              <Button size="sm">{t('change_plan')} </Button>
            )}
          </Link>
        </Flex>
        <hr className="my-7" />
        <Text>
        {t('curent_usage')}: 
          </Text>
        <div className="grid mt-10 grid-cols-1 gap-4 lg:grid-cols-2">
          {planCapabilities
            ?.filter((c) => c.capabilitie.type === "LIMIT")
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
        <hr className="my-7" />
        <div>
          <Text>
          {t('plan_features')}   : 
          </Text>
          <ul
            role="list"
            className="divide-y my-3 grid grid-cols-2 lg:grid-cols-4 space-y-3 divide-gray-100"
          >
            {planCapabilities?.map((capa, index: number) => (
              <li
                key={`capa-${index}`}
                className="items-center flex space-x-3 p-1"
              >
                {capa.capabilitie.type === "PERMISSION" ? (
                  capa.count == 1 ? (
                    <button className="icon mr-2">
                      {" "}
                      <CheckBadgeIcon />{" "}
                    </button>
                  ) : (
                    <button className="icon mr-2">
                      {" "}
                      <XMarkIcon />
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
