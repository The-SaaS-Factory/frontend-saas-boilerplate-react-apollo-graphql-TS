/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import {
  GET_SUPER_ADMIN_SETTINGS,
  SAVE_SUPER_ADMIN_SETTINGS,
} from "./superAdminSettingGraphql";
import NewForm from "@/components/core/NewForm";
import { parseSettingDataOnSubmit } from "@/utils/facades/formFacade";
import { handleRequestError } from "@/utils/facades/handleRequestError";

const SuperAdminSettingsIntegrations = () => {
  const [saveSettings] = useMutation(SAVE_SUPER_ADMIN_SETTINGS);
  const { data: getSettings, refetch } = useQuery(GET_SUPER_ADMIN_SETTINGS);
  const formInfo = {
    name: "ImageKit",
    description: "CDN Image (imagekit.io)",
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

  const onSubmit = async (data: any) => {
    const payload = await parseSettingDataOnSubmit(data, fields);

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

  return (
    <>
      <NewForm
        values={getSettings?.getSuperAdminSettings}
        info={formInfo}
        fields={fields}
        onSubmit={onSubmit}
      />{" "}
      
    </>
  );
};

export default SuperAdminSettingsIntegrations;
