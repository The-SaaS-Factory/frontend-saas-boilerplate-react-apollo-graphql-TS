import NewForm from "../../../../components/commons/NewForm";
import {
  GET_SUPER_ADMIN_SETTINGS,
  SAVE_SUPER_ADMIN_SETTINGS,
} from "../../../../utils/queries";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { parseSettingDataOnSubmit } from "../../../../utils/facades/formFacade";
import { useTranslation } from "react-i18next";

const SuperAdminSettingsInvoicing = () => {
  const [saveSettings] = useMutation(SAVE_SUPER_ADMIN_SETTINGS);
  const { data: getSettings, refetch } = useQuery(GET_SUPER_ADMIN_SETTINGS);
  const { t } = useTranslation("superadmin");

  const formInfo = {
    name: t("stripe_integration"),
    description: t("stripe_integration_configure"),
  };

  const fieldsStripe = [
    {
      name: "STRIPE_CLIENT_ENABLED",
      label: "STRIPE_CLIENT_ENABLED",
      required: false,
      type: "toggle",
    },
    {
      name: "STRIPE_MODE",
      label: "STRIPE_MODE",
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
      name: "STRIPE_CHECKOUT_MODE",
      label: "STRIPE_CHECKOUT_MODE",
      type: "select",
      required: false,
      options: [
        {
          optionName: "Stripe Elements",
          optionValue: "ELEMENTS",
        },
        {
          optionName: "Stripe Ckeckout",
          optionValue: "CHECKOUT",
        },
      ],
    },

    {
      name: "STRIPE_CLIENT_PK_SANDBOX",
      label: "STRIPE_CLIENT_PK_SANDBOX",
      required: false,
      type: "text",
    },
    {
      name: "STRIPE_CLIENT_PK_PRODUCTION",
      label: "STRIPE_CLIENT_PK_PRODUCTION",
      required: false,
      type: "text",
    },
    {
      name: "STRIPE_CLIENT_SECRET_SANDBOX",
      label: "STRIPE_CLIENT_SECRET_SANDBOX",
      required: false,
      type: "text",
    },
    {
      name: "STRIPE_CLIENT_SECRET_PRODUCTION",
      label: "STRIPE_CLIENT_SECRET_PRODUCTION",
      required: false,
      type: "text",
    },
    {
      name: "STRIPE_ENDPOINT_SECRET",
      label: "STRIPE_ENDPOINT_SECRET",
      required: false,
      type: "text",
    },
    {
      name: "STRIPE_PRODUCT_BY_DEFAULT",
      label: "STRIPE_PRODUCT_BY_DEFAULT",
      required: false,
      type: "text",
    },
  ];

  const onSubmitStripe = (data: any) => {
    let payload = parseSettingDataOnSubmit(data, fieldsStripe);

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
        fields={fieldsStripe}
        onSubmit={onSubmitStripe}
      />
    </>
  );
};

export default SuperAdminSettingsInvoicing;
