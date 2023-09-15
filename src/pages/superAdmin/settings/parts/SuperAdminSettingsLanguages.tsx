import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_LANGUAGE,
  DELETE_LANGUAGE,
  GET_LANGUAGES,
} from "../../../../utils/queries";
import { toast } from "sonner";
import { Card, Flex } from "@tremor/react";
import { ArchiveBoxArrowDownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { LanguageType } from "../../../../types/Types";

const SuperAdminSettingsLanguages = () => {
  const { register, setValue, handleSubmit, watch, reset } = useForm();
  const { data: languages, refetch } = useQuery(GET_LANGUAGES);
  const { t } = useTranslation("superadmin");
  const [saveLanguage] = useMutation(CREATE_LANGUAGE, {
    onCompleted: (data) => {
      toast.success("Idioma agregado!");
      reset();
      refetch();
    },
    onError(error, clientOptions) {
      toast.error(error.message);
    },
  });

  const [deleteLanguage] = useMutation(DELETE_LANGUAGE, {
    onCompleted: (data) => {
      toast.success(t("language_added"));
      refetch();
    },
    onError(error, clientOptions) {
      toast.error(error.message);
    },
  });

  const storeNewLanguage = (data: any) => {
    const payload = {
      name: data.name,
      lng: data.lng,
    };

    saveLanguage({ variables: payload });
  };

  const handleDeleteLanguaage = (languageId) => {
    const id = parseInt(languageId);
    deleteLanguage({ variables: { languageId: id } });
  };

  return (
    <>
      <div className="grid lg:gap-7 lg:grid-cols-2 ">
        <div>
          {languages?.getLanguages.map((language: LanguageType) => (
            <Card className="my-3" key={`${language.id}`}>
              <Flex>
                <span className="text">
                  {language.name} - {language.lng}
                </span>
                <button
                  onClick={() => handleDeleteLanguaage(language.id)}
                  className="icon"
                >
                  <ArchiveBoxArrowDownIcon />
                </button>
              </Flex>
            </Card>
          ))}
        </div>
        <div className="  ">
          <h2 className="subtitle py-3">{t("new_language")}</h2>
          <form onSubmit={handleSubmit(storeNewLanguage)}>
            <div className="flex flex-col space-y-1">
              <span className="text-content text-sm text">{t("name")}</span>
              <input {...register("name")} type="text" className="input-text" />
            </div>

            <div className="flex flex-col space-y-1 mt-3">
              <span className="text-content text-sm text">{t("code")}</span>
              <input
                type="text"
                className="input-text"
                placeholder="Ej. en, es, pt"
                {...register("lng")}
              />
            </div>

            <div className="flex flex-col mt-3 mx-auto w-1/3 space-y-1">
              <button type="submit" className="btn-main">
                {t("create")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SuperAdminSettingsLanguages;
