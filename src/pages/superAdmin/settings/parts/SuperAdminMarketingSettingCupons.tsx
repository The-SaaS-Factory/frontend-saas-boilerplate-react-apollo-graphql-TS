import { useTranslation } from "react-i18next";

const SuperAdminMarketingSettingCupons = () => {
  const { t } = useTranslation("superadmin");

  return (
    <>
      <span className="text-gray-500 text-sm p-2">{t('coming_soon')}</span>
    </>
  );
};

export default SuperAdminMarketingSettingCupons;
