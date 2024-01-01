import { useQuery } from "@apollo/client";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  Badge,
} from "@tremor/react";

import { GET_ALL_SUBSCRIPTIONS } from "./plansGraphql";
import SkeltonTable from "@/components/ui/loaders/SkeltonTable";
import PageName from "@/components/ui/commons/PageName";
import { MembershipType } from "./plansTypes";
import { formatTimestampToDateString } from "@/utils/facades/strFacade";
import NotFound from "@/components/ui/commons/NotFound";
import ForbiddenPage from "@/components/layouts/errors/ForbiddenPage";
import useSuperAdmin from "@/utils/hooks/useSuperAdmin";

const SuperAdminSubscriptionPage = () => {
  const { hasModulePermission } = useSuperAdmin("superAdmin:billing:read");

  const { data: subscriptions, loading } = useQuery(GET_ALL_SUBSCRIPTIONS);

  if (loading) {
    return <SkeltonTable count={10} />;
  }

  if (!hasModulePermission) {
    return (
      <div className="">
        <ForbiddenPage />
      </div>
    );
  }

  return (
    <div>
      <PageName
        name={"Subscriptions"}
        breadcrumbs={[
          { name: "Dashboard", href: "/admin" },
          { name: "Subscriptions", href: "#" },
        ]}
      />

      {subscriptions?.getAllSubscriptions?.length === 0 ? (
        <div className="py-14">
          <NotFound message="No Subscriptions Found" />
        </div>
      ) : (
        <Table className="mt-6">
          <TableHead>
            <TableRow className="">
              <TableHeaderCell className="text-left">
                User / Organization
              </TableHeaderCell>
              <TableHeaderCell className="text-center">Plan</TableHeaderCell>
              <TableHeaderCell className="text-center">Amount</TableHeaderCell>
              <TableHeaderCell className="text-center">Created</TableHeaderCell>
              <TableHeaderCell className="text-center">Expires</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {subscriptions?.getAllSubscriptions?.map(
              (item: MembershipType, index: number) => (
                <TableRow key={`userS-${item.id + index}`}>
                  <TableCell className="text-left items-center">
                    <span>{item.organization?.name || item.user?.name}</span>
                  </TableCell>
                  <TableCell className="text-center text">
                    {item.plan.name}
                  </TableCell>
                  <TableCell className="text-center text">
                    <Badge color={"green"}>
                      {item.invoice &&
                        "$" + Number(item.invoice?.amount).toFixed(2)}
                    </Badge>
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
      )}
    </div>
  );
};

export default SuperAdminSubscriptionPage;
