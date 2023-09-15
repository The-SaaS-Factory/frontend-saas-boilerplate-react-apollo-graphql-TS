import NewForm from "../../../../components/commons/NewForm";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_PLANS,
  GET_SUPER_ADMIN_SETTINGS,
  SAVE_SUPER_ADMIN_SETTINGS,
} from "../../../../utils/queries";
import { toast } from "sonner";
import { parseSettingDataOnSubmit } from "../../../../utils/facades/formFacade";
import { useTranslation } from "react-i18next";
import { UserMembershipPlanType } from "../../../../types/Types";

const SuperAdminMarketingSettingGeneral = () => {
  const [saveSettings] = useMutation(SAVE_SUPER_ADMIN_SETTINGS);
  const { data: getSettings, refetch } = useQuery(GET_SUPER_ADMIN_SETTINGS);
  const { t } = useTranslation("superadmin");
  const { data: plans, loading } = useQuery(GET_PLANS, {
    onError(error) {
      console.log(error);
    },
  });

  const formInfo = {
    name: t("free_trial"),
    description: t("free_trial_config"),
  };
  const fields = [
    {
      name: "MARKETING_FREE_TRIAL",
      label: t("free_trial_enabled"),
      type: "toggle",
      required: true,
    },
    {
      name: "MARKETING_FREE_DAYS",
      label: t("days_free"),
      type: "number",
      required: true,
    },
    {
      name: "MARKETING_FREE_TRIAL_PLAN",
      label: t("plan_for_free_trial"),
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

export default SuperAdminMarketingSettingGeneral;
