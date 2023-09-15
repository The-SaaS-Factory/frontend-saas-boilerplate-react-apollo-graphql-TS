import React from "react";
import { GET_PLATFORM_GENERAL_DATA } from "../../../utils/queries";
import { useQuery } from "@apollo/client";
import { getSettingValue } from "../../../utils/facades/resorceFacade";

const SupportKnowledgePage = () => {
  const { data: getSettings, refetch } = useQuery(GET_PLATFORM_GENERAL_DATA);
  const settings = getSettings?.getPlatformGeneralData ?? [];
  const urlDoc: string = getSettingValue(settings, "DOC_EXTERNAL_LINK");
  return (
    <div>
      <a href={urlDoc}>{urlDoc}</a>
    </div>
  );
};

export default SupportKnowledgePage;
