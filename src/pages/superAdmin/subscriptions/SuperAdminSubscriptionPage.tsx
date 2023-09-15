import { useQuery } from "@apollo/client";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
} from "@tremor/react";
import { GET_ALL_SUBSCRIPTIONS } from "../../../utils/queries";
import SkeltonTable from "../../../components/commons/SkeltonTable";
import PageName from "../../../components/commons/PageName";
import { formatTimestampToDateString } from "../../../utils/facades/strFacade";
import UserCard from "../../../components/commons/UserCard";
import { useTranslation } from "react-i18next";
import { MembershipType } from "../../../types/Types";

const SuperAdminSubscriptionPage = () => {
  const { t } = useTranslation("superadmin");

  const { data: subscriptions, loading } = useQuery(GET_ALL_SUBSCRIPTIONS, {
    onError(error) {
      console.log(error);
    },
  });

  if (loading) {
    return <SkeltonTable count={10} />;
  }

  return (
    <div>
      <PageName
        name={t("subscriptions")}
        breadcrumbs={[
          { name: t("dashboard"), href: "/admin" },
          { name: t("subscriptions"), href: "#" },
        ]}
      />

      <Table className="mt-6">
        <TableHead>
          <TableRow className="">
            <TableHeaderCell className="text-left">{t("user")}</TableHeaderCell>
            <TableHeaderCell className="text-center">
              {t("plan")}
            </TableHeaderCell>
            <TableHeaderCell className="text-center">
              {t("gateway")}{" "}
            </TableHeaderCell>
            <TableHeaderCell className="text-center">
              {t("created")}{" "}
            </TableHeaderCell>
            <TableHeaderCell className="text-center">
              {t("next_due")}
            </TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {subscriptions?.getAllSubscriptions?.map(
            (item: MembershipType, index: number) => (
              <TableRow key={`userS-${item.id + index}`}>
                <TableCell className="text-center items-center">
                  <UserCard user={item.user} />
                </TableCell>
                <TableCell className="text-center text">{item.plan.name}</TableCell>
                <TableCell className="text-center text">
                  {item.invoice &&
                    "$" +
                      item.invoice?.amount +
                      " " +
                      item.invoice?.currency?.name}
                </TableCell>
                <TableCell className="text-center text">
                  {formatTimestampToDateString(item.startDate)}{" "}
                </TableCell>
                <TableCell className="text-center text">
                  {formatTimestampToDateString(item.endDate)}{" "}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SuperAdminSubscriptionPage;
