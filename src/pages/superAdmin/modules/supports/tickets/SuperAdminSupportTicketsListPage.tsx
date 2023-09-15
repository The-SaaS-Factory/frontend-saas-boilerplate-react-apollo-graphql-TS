import React from "react";

import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
} from "@tremor/react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { formatTimestampToDateString } from "../../../../../utils/facades/strFacade";
import { GET_SUPPORT_TICKETS } from "../../../../../utils/queries";
import SkeltonTable from "../../../../../components/commons/SkeltonTable";

import { useTranslation } from "react-i18next";
const SuperAdminSupportTicketsListPage = () => {
  const { data: tickets, loading } = useQuery(GET_SUPPORT_TICKETS);
  const { t } = useTranslation("superadmin");
  if (loading) {
    return <SkeltonTable count={10} />;
  }
  return (
    <div>
      <Table className="mt-6">
        <TableHead>
          <TableRow className="">
            <TableHeaderCell className="text-left">
              {t("subject")}
            </TableHeaderCell>
            <TableHeaderCell className="text-left">
              {t("departament")}{" "}
            </TableHeaderCell>
            <TableHeaderCell className="text-center">
              {t("status")}
            </TableHeaderCell>
            <TableHeaderCell className="text-center">
              {t("date")}
            </TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tickets?.getSupportTickets.map((item: any, index: number) => (
            <TableRow key={`userInvoice-${index}`}>
              <TableCell className="text-left text">
                {item.subject.substring(0,43,'...')} - (ID-{item.id})
              </TableCell>
              <TableCell className="text-left space-x-3  ">
                <span className="uppercase">{item.departament}</span>
              </TableCell>
              <TableCell className="text-center text">
                {showTicketStatus(item.status)}
              </TableCell>
              <TableCell className="text-center text">
                {formatTimestampToDateString(item.createdAt)}
              </TableCell>
              <TableCell className="text-center text">
                <Link
                  to={`/admin/support/ticket/${item.id}`}
                  className="btn-main"
                >
                  {t("view_ticket")}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {tickets?.getSupportTickets.length === 0 && (
        <span className="px-3 text"> {t("not_ticket_found")} </span>
      )}
    </div>
  );
};

export const showTicketStatus = (status: string): JSX.Element => {
  if (status === "OPEN") {
    return <span className={"badge-pending"}>{status}</span>;
  } else if (status === "AWAITING_RESPONSE") {
    return <span className={"badge-green"}>{status}</span>;
  } else if (status === "UNDER_REVIEW") {
    return <span className={"badge-orange"}>{status}</span>;
  } else if (status === "CANCELED") {
    return <span className={"badge-red"}>{status}</span>;
  } else if (status === "REOPENED") {
    return <span className={"badge-paid"}>{status}</span>;
  } else {
    return <span className={"badge-unknown"}>unknown status</span>;
  }
};

export default SuperAdminSupportTicketsListPage;
