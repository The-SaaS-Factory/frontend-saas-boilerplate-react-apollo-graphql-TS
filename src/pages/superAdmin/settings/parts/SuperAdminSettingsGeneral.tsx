import NewForm from "../../../../components/commons/NewForm";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_SUPER_ADMIN_SETTINGS,
  SAVE_SUPER_ADMIN_SETTINGS,
} from "../../../../utils/queries";
import { toast } from "sonner";
import { parseSettingDataOnSubmit } from "../../../../utils/facades/formFacade";
import { useTranslation } from "react-i18next";

const SuperAdminSettingsGeneral = () => {
  const [saveSettings] = useMutation(SAVE_SUPER_ADMIN_SETTINGS);
  const { data: getSettings, refetch } = useQuery(GET_SUPER_ADMIN_SETTINGS);
  const { t } = useTranslation("superadmin");

  const formInfo = {
    name: t("general_information"),
    description: t("configure_information_platfom"),
  };

  const fields = [
    {
      name: "PLATFORM_NAME",
      label: t("platform_name"),
      type: "text",
      required: false,
    },
    {
      name: "PLATFORM_RESUME",
      label: t("platform_resume"),
      type: "text",
      required: false,
    },
    {
      name: "PLATFORM_ADDRESS",
      label: t("platform_address"),
      type: "text",
      required: false,
    },
    {
      name: "PLATFORM_EMAIL",
      label: t("platform_email"),
      type: "text",
      required: false,
    },
    {
      name: "PLATFORM_FAVICON",
      label: t("favicon_url"),
      type: "text",
      required: false,
    },
    {
      name: "PLATFORM_LOGO",
      label: t("logo_url"),
      type: "text",
      required: false,
    },
    {
      name: "PLATFORM_DEMO_URL",
      label: t("demo_url"),
      type: "text",
      required: false,
    },
    {
      name: "PLATFORM_DOC_URL",
      label: t("doc_url"),
      type: "text",
      required: false,
    },
    {
      name: "PLATFORM_FRONTEND_URL",
      label: t("PLATFORM_FRONTEND_URL"),
      type: "text",
      required: false,
    },
  ];

  const onSubmit = (data: any) => {
    let payload = parseSettingDataOnSubmit(data, fields);

    saveSettings({
      variables: {
        settings: payload,
      },
    })
      .then((r) => {
        refetch();
        toast.success(t("setting_updated"));
      })
      .catch((e) => {
        console.log(e);
        toast.error("Error");
      });
  };

  const formInfoSocialMedia = {
    name: t("social_media_link"),
    description: t("social_media_link_configure"),
  };

  const fieldsSocialMedia = [
    {
      name: "LINK_FACEBOOK",
      label: "Facebook",
      type: "text",
      required: false,
    },
    {
      name: "LINK_INSTAGRAM",
      label: "Instagram",
      type: "text",
      required: false,
    },
    {
      name: "LINK_TWITTER",
      label: "Twitter",
      type: "text",
      required: false,
    },
    {
      name: "LINK_GITHUB",
      label: "Github",
      type: "text",
      required: false,
    },
    {
      name: "LINK_YOUTUBE",
      label: "Youtube",
      type: "text",
      required: false,
    },
  ];

  const onSubmitSocialMedia = (data: any) => {
    let payload = parseSettingDataOnSubmit(data, fieldsSocialMedia);

    saveSettings({
      variables: {
        settings: payload,
      },
    })
      .then((r) => {
        refetch();
        toast.success(t("setting_updated"));
      })
      .catch((e) => {
        console.log(e);
        toast.error("Error");
      });
  };

  return (
    <>
      <NewForm
        values={getSettings?.getSuperAdminSettings}
        info={formInfo}
        fields={fields}
        onSubmit={onSubmit}
      />{" "}
      <hr className="my-7" />
      <NewForm
        values={getSettings?.getSuperAdminSettings}
        info={formInfoSocialMedia}
        fields={fieldsSocialMedia}
        onSubmit={onSubmitSocialMedia}
      />
    </>
  );
};

export default SuperAdminSettingsGeneral;
