import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import {
  CREATE_CAPABILITIE,
  CREATE_RESOURCE,
  GET_RESOURCES,
} from "../../../../utils/queries";
import { parseDataOnSubmit } from "../../../../utils/facades/formFacade";
import { toast } from "sonner";
import PageName from "../../../../components/commons/PageName";
import NewForm from "../../../../components/commons/NewForm";
import Loading from "../../../../components/commons/Loading";

const SuperAdminDownloadCreatePage = () => {
  const { resourceId } = useParams();
  const { t } = useTranslation("superadmin");
  const { data: resources } = useQuery(GET_RESOURCES);
  //States
  const [newDataForCapabilitie, setDataForCapabilitie] = useState(0);
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);

  const formInfo = {
    name: t("create_resources"),
    description: t("add_resource_description"),
  };

  const fields = [
    {
      name: "name",
      label: t("name"),
      type: "text",
      required: true,
    },
    {
      name: "slug",
      label: t("slug"),
      type: "slug",
      slug: "name",
      required: true,
    },
    {
      name: "type",
      label: t("type"),
      type: "text",
      required: true,
    },
    {
      name: "resume",
      label: t("resume"),
      type: "textarea",
      required: true,
    },
    {
      name: "description",
      label: t("description"),
      type: "textarea",
      required: true,
    },
    {
      name: "linkVideo",
      label: t("linkVideo"),
      type: "text",
      required: false,
    },
    {
      name: "linkDemo",
      label: t("linkDemo"),
      type: "text",
      required: false,
    },
    {
      name: "linkDownload",
      label: t("linkDownload"),
      type: "text",
      required: false,
    },
    {
      name: "image",
      label: t("image"),
      type: "image",
      required: true,
    },
  ];

  //Funtions and hooks
  const navigate = useNavigate();
  const [saveResource] = useMutation(CREATE_RESOURCE);

  const onSubmit = async (data: any) => {
    setLoading(true);
    let payload = await parseDataOnSubmit(data, fields);

    if (resourceId) {
      payload["resourceId"] = parseInt(resourceId);
    }

    saveResource({
      variables: payload,
    })
      .then((r) => {
        setLoading(false);
        toast.success(t("resource_created"));
        window.scrollTo(0, 0);
        navigate("/admin/downloads?reload=true");
        
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
        toast.error(e.message);
        return "error";
      });
  };

  useEffect(() => {
    const data = resources?.getResources;
    if (resourceId && data && data.length > 0) {
      const resourceFound = data.find((p) => p.id == parseInt(resourceId));
      if (resourceFound) {
        setValues(resourceFound);
      }
    }
  }, [resourceId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <PageName
        name={t("manage_resource")}
        breadcrumbs={[
          { name: t("dashboard"), href: "/admin" },
          { name: t("resources"), href: "/admin/downloads" },
          { name: t("manage_resource"), href: "#" },
        ]}
      />
      <NewForm
        values={values}
        info={formInfo}
        fields={fields}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default SuperAdminDownloadCreatePage;
