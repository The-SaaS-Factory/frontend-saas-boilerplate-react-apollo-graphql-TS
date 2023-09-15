import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
} from "@tremor/react";
import { useMutation, useQuery } from "@apollo/client";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { DELETE_RESOURCE, GET_RESOURCES } from "../../../../utils/queries";
import SkeltonTable from "../../../../components/commons/SkeltonTable";
import { ResourceType } from "../../../../types/Types";
import { formatTimestampToDateString } from "../../../../utils/facades/strFacade";
import { useEffect } from "react";
import { toast } from "sonner";
import { ArchiveBoxArrowDownIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
const SuperAdminDownloadListPage = () => {
  //?reload=true
  const reload = window.location.search;
  useEffect(() => {
    if (reload) {
      refetch();
      window.history.replaceState(
        null,
        document.title,
        window.location.pathname
      );
    }
  }, [reload]);

  const [deleteResource] = useMutation(DELETE_RESOURCE);
  const { data: resources, loading, refetch } = useQuery(GET_RESOURCES);
  const navigate = useNavigate();
  const { t } = useTranslation("superadmin");
  if (loading) {
    return <SkeltonTable count={10} />;
  }

  const deleteResourceFn = (resourceId) => {
    toast(t("sure_delete_resource"), {
      action: {
        label: t("delete"),
        onClick: () =>
          deleteResource({
            variables: {
              resourceId: parseInt(resourceId),
            },
          })
            .then((r) => {
              toast.success(t("resource_deleted"));
              refetch();
            })
            .catch((e) => toast.error(e.message)),
      },
    });
  };

  return (
    <div>
      <Table className="mt-6">
        <TableHead>
          <TableRow className="">
            <TableHeaderCell className="text-left">
              {t("subject")}
            </TableHeaderCell>
            <TableHeaderCell className="text-left">
              {t("type")}{" "}
            </TableHeaderCell>
            <TableHeaderCell className="text-center">
              {t("resume")}
            </TableHeaderCell>
            <TableHeaderCell className="text-center">
              {t("date")}
            </TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {resources?.getResources.map((item: ResourceType, index: number) => (
            <TableRow key={`userInvoice-${index}`}>
              <TableCell className="text-left text">
                {item.name.substring(0, 43)} - (ID-{item.id})
              </TableCell>
              <TableCell className="text-left space-x-3  ">
                <span className="uppercase text">{item.type}</span>
              </TableCell>
              <TableCell className="text-center text">
                <div
                  dangerouslySetInnerHTML={{
                    __html: item.resume,
                  }}
                ></div>
              </TableCell>
              <TableCell className="text-center text">
                {formatTimestampToDateString(item.createdAt)}
              </TableCell>
              <TableCell className="justify-end flex space-x-3">
                <button
                  onClick={() => navigate(`/admin/downloads/edit/${item.id}`)}
                  className="icon "
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </button>
                <button
                  className="icon "
                  onClick={() => deleteResourceFn(item.id)}
                >
                  <ArchiveBoxArrowDownIcon className="h-5 w-5" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {resources?.getResources.length === 0 && (
        <span className="px-3 text"> {t("not_resources_found")} </span>
      )}
    </div>
  );
};

export default SuperAdminDownloadListPage;
