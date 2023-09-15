import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  Badge,
} from "@tremor/react";

import { GET_USERS } from "../../../utils/queries";
import { useQuery } from "@apollo/client";
import PageName from "../../../components/commons/PageName";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import Search from "../../../components/commons/Search";
import { formatTimestampToDateString } from "../../../utils/facades/strFacade";
import UserCard from "../../../components/commons/UserCard";
import { UserInputType, UserType } from "../../../types/Types";
import Loading from "../../../components/commons/Loading";
import { useTranslation } from "react-i18next";

export default function SuperAdminUsersPage() {
  const { t } = useTranslation("superadmin");
  const {
    data: users,
    loading,
    refetch: refreshUsers,
  } = useQuery(GET_USERS, {
    variables: {
      offset: 0,
      limit: 50,
    },
    onError(error) {
      console.log(error);
    },
  });

  const handleFindRefetch = (variables: UserInputType) => {
    refreshUsers(variables);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <PageName
        name={t("users")}
        breadcrumbs={[
          { name: t("dashboard"), href: "/admin" },
          { name: t("manage_users"), href: "#" },
        ]}
      />
      <div>
        <div className="p-1 ">
          <Search refresh={handleFindRefetch} />
        </div>
        <Table className="mt-6">
          <TableHead>
            <TableRow className="">
              <TableHeaderCell className="text-left">
                {" "}
                {t("info")}
              </TableHeaderCell>
              <TableHeaderCell className="text-center">
                {" "}
                {t("plan")}
              </TableHeaderCell>
              <TableHeaderCell className="text-center">
                {t("ubication")}
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.getUsers?.map((user: UserType, index: number) => (
              <TableRow key={`user-${index}`}>
                <TableCell className="text-center items-center">
                  <UserCard user={user} />
                </TableCell>
                <TableCell className="text-center text">
                  <Badge icon={CalendarDaysIcon} size="md">
                    {user.Membership[0]?.plan?.name ?? "-"}{" "}
                    {user.Membership[0]?.endDate
                      ? formatTimestampToDateString(user.Membership[0]?.endDate)
                      : "-"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text">
                  {user.country} - {user.state} - {user.city}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
