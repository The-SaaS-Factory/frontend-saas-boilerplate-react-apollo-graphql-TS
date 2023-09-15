import NewForm from "../../../../components/commons/NewForm";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_SUPER_ADMIN_SETTINGS,
  SAVE_SUPER_ADMIN_SETTINGS,
} from "../../../../utils/queries";
import { toast } from "sonner";
import { parseSettingDataOnSubmit } from "../../../../utils/facades/formFacade";
import { useTranslation } from "react-i18next";

const SuperAdminSettingsIntegrations = () => {
  const [saveSettings] = useMutation(SAVE_SUPER_ADMIN_SETTINGS);
  const { data: getSettings, refetch } = useQuery(GET_SUPER_ADMIN_SETTINGS);
  const { t } = useTranslation("superadmin");
  const formInfo = {
    name: "ImageKit",
    description: t("cdn_image"),
  };
  const formInfoSMTP = {
    name:  t("email_service") ,
    description: t("email_service_setting"),
  };

  const fields = [
    {
      name: "IMAGEKIT_PUBLIC_KEY",
      label: "IMAGEKIT_PUBLIC_KEY",
      type: "text",
      required: false,
    },
    {
      name: "IMAGEKIT_PRIVATE_KEY",
      label: "IMAGEKIT_PRIVATE_KEY",
      type: "text",
      required: false,
    },
    {
      name: "IMAGEKIT_URL_ENDPOINT",
      label: "IMAGEKIT_URL_ENDPOINT",
      type: "text",
      required: false,
    },
  ];
  const fieldsSmtp = [
    {
      name: "SMTP_MODE",
      label: "SMTP_MODE",
      type: "select",
      required: false,
      options: [
        {
          optionName: "SANDBOX",
          optionValue: "test",
        },
        {
          optionName: "PRODUCTION",
          optionValue: "prod",
        },
      ],
    },
    {
      name: "SMTP_SENDER_ADDRESS",
      label: "Sender Email",
      type: "text",
      required: false,
    },
    {
      name: "SMTP_HOST_TEST",
      label: "SMTP_HOST_TEST",
      type: "text",
      required: false,
    },
    {
      name: "SMTP_PORT_TEST",
      label: "SMTP_PORT_TEST",
      type: "number",
      required: false,
    },
    {
      name: "SMTP_USER_TEST",
      label: "SMTP_USER_TEST",
      type: "text",
      required: false,
    },
    {
      name: "SMTP_PASSWORD_TEST",
      label: "SMTP_PASSWORD_TEST",
      type: "text",
      required: false,
    },
    {
      name: "SMTP_HOST",
      label: "SMTP_HOST_PROD",
      type: "text",
      required: false,
    },
    {
      name: "SMTP_PORT",
      label: "SMTP_PORT_PROD",
      type: "text",
      required: false,
    },
    {
      name: "SMTP_USER",
      label: "SMTP_USER_PROD",
      type: "text",
      required: false,
    },
    {
      name: "SMTP_PASSWORD",
      label: "SMTP_PASSWORD_PROD",
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
        toast.success(t('setting_updated'));
      })
      .catch((e) => {
        console.log(e);
        toast.error("Error");
      });
  };

  const onSubmitSmtp = (data: any) => {
    let payload = parseSettingDataOnSubmit(data, fieldsSmtp);

    saveSettings({
      variables: {
        settings: payload,
      },
    })
      .then((r) => {
        refetch();
        toast.success(t('setting_updated'));
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
      /> 
      <hr className="my-7" />
      <NewForm
        values={getSettings?.getSuperAdminSettings}
        info={formInfoSMTP}
        fields={fieldsSmtp}
        onSubmit={onSubmitSmtp}
      />
    </>
  );
};

export default SuperAdminSettingsIntegrations;
