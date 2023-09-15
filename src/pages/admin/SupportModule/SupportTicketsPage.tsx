import React from "react";
import { GET_USER_SUPPORT_TICKETS } from "../../../utils/queries";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  Badge,
} from "@tremor/react";
import { useQuery } from "@apollo/client";
import { formatTimestampToDateString } from "../../../utils/facades/strFacade";
import { Link } from "react-router-dom";
const SupportTicketsPage = ({ tickets }) => {
  return (
    <div>
      <Table className="mt-6">
        <TableHead>
          <TableRow className="">
            <TableHeaderCell className="text-left">Subject</TableHeaderCell>
            <TableHeaderCell className="text-left">Departament</TableHeaderCell>
            <TableHeaderCell className="text-center">Status</TableHeaderCell>
            <TableHeaderCell className="text-center">Date</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tickets?.getSupportTicketsForUser.map((item: any, index: number) => (
            <TableRow key={`userInvoice-${index}`}>
              <TableCell className="text-left text">
                {item.subject} - (ID-{item.id})
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
                <Link to={`ticket/${item.id}`} className="btn-main">
                  View Ticket{" "}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {tickets?.getSupportTicketsForUser.length === 0 && (
        <span className="px-3 text">Not invoices found</span>
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
  } else if (status === "CLOSED") {
    return <span className={"badge-sky"}>{status}</span>;
  } else if (status === "REOPENED") {
    return <span className={"badge-paid"}>{status}</span>;
  } else {
    return <span className={"badge-unknown"}>unknown status</span>;
  }
};

export default SupportTicketsPage;
