import { useMutation, useQuery } from "@apollo/client";
import {
  GET_SUPER_ADMIN_SETTINGS,
  SAVE_SUPER_ADMIN_SETTINGS,
} from "../../../../../utils/queries";
import NewForm from "../../../../../components/commons/NewForm";
import { toast } from "sonner";
import { parseSettingDataOnSubmit } from "../../../../../utils/facades/formFacade";
import { useTranslation } from "react-i18next";

const SuperAdminSupportKnowledgePage = () => {
  const [saveSettings] = useMutation(SAVE_SUPER_ADMIN_SETTINGS);
  const { data: getSettings, refetch } = useQuery(GET_SUPER_ADMIN_SETTINGS);
  const { t } = useTranslation("superadmin");
  const formInfo = {
    name: t('external_documentation'),
    description: t('setting_external_documentation'),
  };

  const fields = [
    {
      name: "DOC_EXTERNAL_LINK",
      label: t('external_documentation_link'),
      required: false,
      type: "text",
    },
  ];

  const onSubmitStripe = (data: any) => {
    let payload = parseSettingDataOnSubmit(data, fields);

    saveSettings({
      variables: {
        settings: payload,
      },
    })
      .then((r) => {
        refetch();
        toast.success(t('settings_updated'));
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
        onSubmit={onSubmitStripe}
      />
      <hr className="my-7" />
    </>
  );
};

export default SuperAdminSupportKnowledgePage;
