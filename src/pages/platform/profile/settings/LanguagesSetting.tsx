import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  GET_CURRENT_USER_FULL,
  GET_LANGUAGES,
  UPDATE_USER,
} from "../../../../utils/queries";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const LanguagesSetting = () => {
  const { t, i18n } = useTranslation("settings");
  const { data: languages } = useQuery(GET_LANGUAGES);
  const { data: user, refetch } = useQuery(GET_CURRENT_USER_FULL);
  const [languageId, setLanguageId] = useState(null);

  const [updateUser, { loading: loadingUpdate, error: errorUpdate }] =
    useMutation(UPDATE_USER, {
      onCompleted(data) {
        toast.success(t("profile_updated"));
        const newLan = languages?.getLanguages?.find(
          (lang: any) => lang.id == languageId
        );
        i18n.changeLanguage(newLan.lng);
        window.location.reload();
      },
      onError(error) {
        console.log(error);

        toast.error(error.message);
      },
    });

  useEffect(() => {
    if (user?.me?.Language?.id) {
      setLanguageId(user?.me?.Language?.id);
    }
  }, [user]);

  const handleUpdateLanguage = () => {
    updateUser({
      variables: {
        languageId: parseInt(languageId ?? user.getCurrentUserFull.Language.id),
      },
    });
  };

  const handleLanguageChange = (event) => {
    setLanguageId(event.target.value);
  };

  return (
    <div>
      {languages?.getLanguages.map((language) => (
        <div key={language.id} className="relative flex items-start py-4">
          <div className="min-w-0 flex-1 text-sm leading-6">
            <label
              htmlFor={`language-${language.id}`}
              className="select-none font-medium text"
            >
              {language.name}
            </label>
          </div>
          <div className="ml-3 flex h-6 items-center">
            <input
              id={`language-${language.id}`}
              name="language"
              type="radio"
              value={language.id}
              checked={languageId === language.id}
              onChange={handleLanguageChange}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
        </div>
      ))}
      <button
        className="btn-main"
        onClick={handleUpdateLanguage}
        disabled={loadingUpdate}
      >
        {t("save")}
      </button>
    </div>
  );
};

export default LanguagesSetting;
