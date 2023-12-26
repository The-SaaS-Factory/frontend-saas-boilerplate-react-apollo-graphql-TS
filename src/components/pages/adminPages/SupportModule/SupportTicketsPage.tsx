/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatTimestampToDateString } from "@/utils/facades/strFacade";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
} from "@tremor/react";
import { Link } from "react-router-dom";
const SupportTicketsPage = ({ tickets }: { tickets: any }) => {
  return (
    <div>
      <Table className="mt-6">
        <TableHead>
          <TableRow className="">
            <TableHeaderCell className="text-left">Assunto</TableHeaderCell>
            <TableHeaderCell className="text-left">
              Departamento
            </TableHeaderCell>
            <TableHeaderCell className="text-center">Estado</TableHeaderCell>
            <TableHeaderCell className="text-center">Data</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tickets?.map((item: any, index: number) => (
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
                  Visualizar
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {tickets?.length === 0 && (
        <span className="px-3 text">Sem histórico de tickets</span>
      )}
    </div>
  );
};

export const showTicketStatus = (status: string): JSX.Element => {
  if (status === "OPEN") {
    return <span className={"badge-pending"}>Open</span>;
  } else if (status === "AWAITING_RESPONSE") {
    return <span className={"badge-green"}>Waiting for response</span>;
  } else if (status === "UNDER_REVIEW") {
    return <span className={"badge-orange"}>Under Review</span>;
  } else if (status === "CANCELED") {
    return <span className={"badge-red"}>Canceled</span>;
  } else if (status === "CLOSED") {
    return <span className={"badge-sky"}>Closed</span>;
  } else if (status === "REOPENED") {
    return <span className={"badge-paid"}>Re Open</span>;
  } else {
    return <span className={"badge-unknown"}>Unknown</span>;
  }
};

export default SupportTicketsPage;
