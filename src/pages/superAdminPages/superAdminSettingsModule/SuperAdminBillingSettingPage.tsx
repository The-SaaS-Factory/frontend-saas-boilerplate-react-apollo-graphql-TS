/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";

import {
  GET_SUPER_ADMIN_SETTINGS,
  SAVE_SUPER_ADMIN_SETTINGS,
} from "./superAdminSettingGraphql";
import { parseSettingDataOnSubmit } from "@/utils/facades/formFacade";
import NewForm from "@/components/core/NewForm";
import { handleRequestError } from "@/utils/facades/handleRequestError";

const SuperAdminBillingSettingPage = () => {
  const [saveSettings] = useMutation(SAVE_SUPER_ADMIN_SETTINGS);
  const { data: getSettings, refetch } = useQuery(GET_SUPER_ADMIN_SETTINGS);

  const formInfo = {
    name: "Stripe Integration",
    description: "Stripe Integration Configuration",
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
  ];

  const onSubmitStripe = async (data: any) => {
    const payload = await parseSettingDataOnSubmit(data, fieldsStripe);

    saveSettings({
      variables: {
        settings: payload,
      },
    })
      .then(() => {
        refetch();
        toast.success("Saved");
      })
      .catch((e) => {
         handleRequestError(e);
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
      <hr className="my-3" />
    </>
  );
};

export default SuperAdminBillingSettingPage;
