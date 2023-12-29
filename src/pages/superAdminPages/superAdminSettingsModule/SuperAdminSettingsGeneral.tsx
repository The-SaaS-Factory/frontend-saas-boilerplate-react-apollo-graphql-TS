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

const SuperAdminSettingsGeneral = () => {
  const [saveSettings] = useMutation(SAVE_SUPER_ADMIN_SETTINGS);
  const {
    data: getSettings,
    refetch,
    error,
  } = useQuery(GET_SUPER_ADMIN_SETTINGS, {
    onError(error) {
      console.log(error);
    },
  });

  console.log(error);

  const formInfo = {
    name: "General Settings",
    description: "General Settings Configuration",
  };

  const fields = [
    {
      name: "PLATFORM_NAME",
      label: "Platform Name",
      type: "text",
      required: false,
    },
    {
      name: "PLATFORM_RESUME",
      label: "Platform Resume",
      type: "text",
      required: false,
    },
    {
      name: "PLATFORM_ADDRESS",
      label: "Platform Address",
      type: "text",
      required: false,
    },
    {
      name: "PLATFORM_EMAIL",
      label: "Platform Email",
      type: "text",
      required: false,
    },
    {
      name: "PLATFORM_FAVICON",
      label: "Favicon URL",
      type: "text",
      required: false,
    },
    {
      name: "PLATFORM_LOGO",
      label: "Logo URL",
      type: "text",
      required: false,
    },
    {
      name: "PLATFORM_DEMO_URL",
      label: "Demo URL",
      type: "text",
      required: false,
    },
    {
      name: "PLATFORM_DOC_URL",
      label: "Documentation URL",
      type: "text",
      required: false,
    },
    {
      name: "PLATFORM_FRONTEND_URL",
      label: "Frontend URL",
      type: "text",
      required: false,
    },
  ];

  const onSubmit = async (data: any) => {
    const payload = await parseSettingDataOnSubmit(data, fields);

    saveSettings({
      variables: {
        settings: payload,
      },
    })
      .then((data) => {
        refetch();
        console.log(data);

        toast.success("Saved");
      })
      .catch((e) => {
        handleRequestError(e);
      });
  };

  const formInfoSocialMedia = {
    name: "Social Media Links",
    description: "Social Media Links Configuration",
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

  const onSubmitSocialMedia = async (data: any) => {
    const payload = await parseSettingDataOnSubmit(data, fieldsSocialMedia);

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
        fields={fields}
        onSubmit={onSubmit}
      />{" "}
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
