import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  GET_LANGUAGES,
  GET_SUPER_ADMIN_SETTINGS,
  SAVE_SUPER_ADMIN_SETTINGS,
} from "../../../../utils/queries";
import { toast } from "sonner";
import { parseSettingDataOnSubmit } from "../../../../utils/facades/formFacade";
import NewForm from "../../../../components/commons/NewForm";
import { useTranslation } from "react-i18next";

const SuperAdminMarketingSettingEmail = () => {
  const [saveSettings] = useMutation(SAVE_SUPER_ADMIN_SETTINGS);
  const { data: getSettings, refetch } = useQuery(GET_SUPER_ADMIN_SETTINGS);
  const { data: languages } = useQuery(GET_LANGUAGES);
  const [fields, setFields] = useState<any>([]);
  const { t } = useTranslation("superadmin");

  const formInfo = {
    name: t("email_welcome"),
    description: t("email_welcome_configure"),
  };

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

  useEffect(() => {
    if (languages) {
      let newFields: any = [];
      languages.getLanguages.map((lng: any) => {
        newFields.push({
          name: `MARKETING_EMAIL_WELCOME_SUBJECT_${lng.lng}`,
          label: `${t("subject_for_user_in")} ${lng.lng}`,
          type: "text",
          required: true,
        });
        newFields.push({
          name: `MARKETING_EMAIL_WELCOME_BODY_${lng.lng}`,
          label: `${t("message_for_user_in")}  ${lng.lng}`,
          type: "textarea",
          required: true,
        });
      });

      setFields(newFields);
    }
  }, [languages]);
  return (
    <div>
      <NewForm
        values={getSettings?.getSuperAdminSettings}
        info={formInfo}
        fields={fields}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default SuperAdminMarketingSettingEmail;
