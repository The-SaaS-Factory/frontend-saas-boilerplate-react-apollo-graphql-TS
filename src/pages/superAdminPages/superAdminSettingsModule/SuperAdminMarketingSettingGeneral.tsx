/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@apollo/client";

import { toast } from "sonner";
import { GET_PLANS } from "../plansModule/plansGraphql";
import {
  GET_SUPER_ADMIN_SETTINGS,
  SAVE_SUPER_ADMIN_SETTINGS,
} from "./superAdminSettingGraphql";
import { UserMembershipPlanType } from "../plansModule/plansTypes";
import { parseSettingDataOnSubmit } from "@/utils/facades/formFacade";
import NewForm from "@/components/core/NewForm";
import { handleRequestError } from "@/utils/facades/handleRequestError";

const SuperAdminMarketingSettingGeneral = () => {
  const [saveSettings] = useMutation(SAVE_SUPER_ADMIN_SETTINGS);
  const { data: getSettings, refetch } = useQuery(GET_SUPER_ADMIN_SETTINGS);
  const { data: plans } = useQuery(GET_PLANS, {
    onError(error) {
      console.log(error);
    },
  });

  const formInfo = {
    name: "Free Trial",
    description: "Free trial configuration",
  };
  const fields = [
    {
      name: "MARKETING_FREE_TRIAL",
      label: "Enable Free Trial",
      type: "toggle",
      required: true,
    },
    {
      name: "MARKETING_FREE_DAYS",
      label: "Days Free",
      type: "number",
      parseToString: true,
      required: true,
    },
    {
      name: "MARKETING_FREE_TRIAL_PLAN",
      label: "Plan for Free Trial",
      type: "select",
      required: true,
      options: plans?.getAllPlans.map((plan: UserMembershipPlanType) => {
        return {
          optionName: plan.name,
          optionValue: plan.id,
        };
      }),
    },
  ];

  const formInfoLoops = {
    name: "Loops Email Marketing",
    description: "Loops Email Marketing (Loops.so)",
  };

  const fieldsLoops = [
    {
      name: "LOOPS_ENABLED",
      label: "Loops Enabled",
      type: "toggle",
      required: true,
    },
    {
      name: "LOOPS_API_KEY",
      label: "Loops API Key",
      type: "text",
      required: true,
    },
    {
      name: "LOOPS_STORE_CONTACTS_ENABLED",
      label: "Save contacts in Loops to register user",
      type: "toggle",
      required: true,
    },
    {
      name: "MARKETING_WELCOME_EMAIL_FOR_USERS_ENABLED",
      label: "Welcome Email for users",
      type: "toggle",
      required: true,
    },
    {
      name: "MARKETING_WELCOME_EMAIL_USER_TRANSACTIONALID",
      label: "Welcome Email for users Transactional ID",
      type: "text",
      required: true,
      note: `You can use the variable "name" in the transactional body (In Loop.so) to show the user's  name.`,
    },
    {
      name: "MARKETING_WELCOME_EMAIL_FOR_ORGANIZATIONS_ENABLED",
      label: "Welcome Email for organizations",
      type: "toggle",
      required: true,
    },
    {
      name: "MARKETING_WELCOME_EMAIL_ORGANIZATION_TRANSACTIONALID",
      label: "Welcome Email for organizations Transactional ID",
      type: "text",
      note: `You can use the variable "name" in the transactional body (In Loop.so) to show the  organization's name.`,
      required: true,
    },
  ];

  const onSubmitLoops = async (data: any) => {
    const payload = await parseSettingDataOnSubmit(data, fieldsLoops);

    saveSettings({
      variables: {
        settings: payload,
      },
    })
      .then(() => {
        refetch();
        toast.success("Setting Updated");
      })
      .catch((e) => {
        handleRequestError(e);
      });
  };

  const onSubmit = async (data: any) => {
    // eslint-disable-next-line prefer-const
    let payload: any = await parseSettingDataOnSubmit(data, fields);
    //Check if need parse some data before send to backend
    fields.forEach((field) => {
      if (field.parseToString) {
        // eslint-disable-next-line prefer-const
        let itemInPayload: any = payload.find(
          (item: any) => item.settingName === field.name
        );

        if (itemInPayload) {
          itemInPayload.settingValue = itemInPayload.settingValue.toString();
        }
      }
    });

    saveSettings({
      variables: {
        settings: payload,
      },
    })
      .then(() => {
        refetch();
        toast.success("Settings saved successfully");
      })
      .catch((e) => {
        handleRequestError(e);
      });
  };

  return (
    <div>
      <NewForm
        values={getSettings?.getSuperAdminSettings}
        info={formInfo}
        fields={fields}
        onSubmit={onSubmit}
      />

      <NewForm
        values={getSettings?.getSuperAdminSettings}
        info={formInfoLoops}
        fields={fieldsLoops}
        onSubmit={onSubmitLoops}
      />
    </div>
  );
};

export default SuperAdminMarketingSettingGeneral;
