import NewCRUD, { FieldTypeType } from "@/components/core/NewCRUD";
import PageName from "@/components/ui/commons/PageName";
import { GET_ALL_INVOICES } from "./invoiceGraphql";
import useSuperAdmin from "@/utils/hooks/useSuperAdmin";
import ForbiddenPage from "@/components/layouts/errors/ForbiddenPage";

const SuperAdminInvoiceModulePage = () => {
  const { hasModulePermission } = useSuperAdmin("superAdmin:billing:read");
  
  const crudSettings = {
    model: "Invoices",
    fields: [
      {
        label: "User",
        name: "user.name",
        type: FieldTypeType.text,
        required: true,
      },
      {
        label: "Organization",
        name: "organization.name",
        type: FieldTypeType.text,
        required: true,
      },
      {
        label: "Amount",
        name: "amount",
        type: FieldTypeType.text,
        required: false,
        columnFormater: (value: string) => {
          return "$ " + Number(value).toFixed(2);
        },
      },
      {
        label: "Status",
        name: "status",
        type: FieldTypeType.text,
        required: false,
        columnFormater: (value: string) => {
          return "$ " + Number(value).toFixed(2);
        },
      },
      {
        label: "Gateway",
        name: "gateway",
        type: FieldTypeType.text,
        required: false,
      },
      {
        label: "PDF Url",
        name: "invoicePdfUrl",
        type: FieldTypeType.link,
        required: false,
      },
      {
        label: "Date",
        name: "createdAt",
        type: FieldTypeType.date,
        required: false,
      },
    ],
    list: {
      queryList: GET_ALL_INVOICES,
      queryListName: "getAllInvoices",
    },
  };

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
        name={"Invoices"}
        breadcrumbs={[
          { name: "Dashboard", href: "/admin" },
          { name: "Invoices", href: "#" },
        ]}
      />

      <NewCRUD settings={crudSettings} />
    </div>
  );
};

export default SuperAdminInvoiceModulePage;
