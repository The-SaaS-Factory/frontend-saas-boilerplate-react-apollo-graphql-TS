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
import { GET_ADMIN_INVOICES } from "../../../utils/queries";
import { useSelector } from "react-redux";
import { formatTimestampToDateString } from "../../../utils/facades/strFacade";
import SkeletonTable from "../../../components/commons/SkeltonTable";
import { useTranslation } from "react-i18next";

const AdminInvoices = () => {
  const { user } = useSelector((state: any) => state.auth);
  const { t } = useTranslation("admin");
  const { data: invoices, loading } = useQuery(GET_ADMIN_INVOICES, {
    variables: {
      userId: parseInt(user.id),
    },
  });

  if(loading){
    return <SkeletonTable count={7} />
  }

  return (
    <div>
      <Table className="mt-6">
        <TableHead>
          <TableRow className="">
            <TableHeaderCell className="text-left">{t('reference')}</TableHeaderCell>
            <TableHeaderCell className="text-left">{t('provider')} </TableHeaderCell>
            <TableHeaderCell className="text-center">{t('status')}</TableHeaderCell>
            <TableHeaderCell className="text-center">{t('amount')}</TableHeaderCell>
            <TableHeaderCell className="text-center">{t('date')}</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {invoices?.getUserInvoice.map((item: any, index: number) => (
            <TableRow key={`userInvoice-${index}`}>
              <TableCell className="text-left text">ID-{item.id}</TableCell>
              <TableCell className="text-left space-x-3  ">
                <span className="uppercase">{item.gateway}</span>
                <span className="text-sky-500">
                  {item.gatewayId && (
                    <a target="_blank" href={item.invoiceUrl}>
                      {" "}
                      {item.gatewayId}{" "}
                    </a>
                  )}
                </span>
              </TableCell>
              <TableCell className="text-center text">
                {item.status === "PENDING" && (
                  <span className={"badge-pending"}>{item.status}</span>
                )}
                {item.status === "PAID" && (
                  <span className={"badge-paid"}>{item.status}</span>
                )}
              </TableCell>
              <TableCell className="text-center  space-x-3">
                <Badge>
                  ${item.amount} {item.currency.name}
                </Badge>
              </TableCell>
              <TableCell className="text-center text">
                {formatTimestampToDateString(item.createdAt)}
              </TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>
          {invoices?.getUserInvoice.length === 0 && (
            <span className="px-3 text">{t('not_invoice_found')} </span>
          )}
    </div>
  );
};

export default AdminInvoices;
