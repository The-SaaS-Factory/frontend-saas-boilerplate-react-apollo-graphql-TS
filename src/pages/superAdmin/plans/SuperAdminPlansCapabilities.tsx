import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { Card, Flex } from "@tremor/react";
import { ArchiveBoxArrowDownIcon } from "@heroicons/react/24/outline";
import {
  CREATE_CAPABILITIE,
  DELETE_CAPABILITIE,
  GET_CAPABILITIES,
} from "../../../utils/queries";
import { useTranslation } from "react-i18next";
import Loading from "../../../components/commons/Loading";

const SuperAdminPlansCapabilities = () => {
  //States

  //Funtions and hooks
  const { t } = useTranslation("superadmin");
  const { register, handleSubmit, reset } = useForm();
  const {
    data: capabilities,
    refetch,
    loading: loadingCapabilities,
  } = useQuery(GET_CAPABILITIES);
  const [saveCapabilitie, { loading }] = useMutation(CREATE_CAPABILITIE, {
    onCompleted: (data) => {
      toast.success(t("capabilitie_added"));
      reset();
      refetch();
    },
    onError(error, clientOptions) {
      toast.error(error.message);
    },
  });

  const [deleteCapabilitie] = useMutation(DELETE_CAPABILITIE, {
    onCompleted: (data) => {
      toast.success(t("capabilitie_deleted"));
      refetch();
    },
    onError(error, clientOptions) {
      toast.error(error.message);
    },
  });

  const storeNewCapabilitie = (data: any) => {
    const payload = {
      name: data.name,
      type: data.type,
      description: data.description,
    };

    saveCapabilitie({ variables: payload });
  };

  const handleDeleteCapabilitie = (capabilitieId) => {
    const id = parseInt(capabilitieId);
    deleteCapabilitie({ variables: { capabilitieId: id } });
  };

  if (loading || loadingCapabilities) {
    return <Loading />;
  }

  return (
    <>
      <div className="grid lg:gap-7 lg:grid-cols-2 ">
        <div>
          {capabilities?.getAllCapabilities.map((capabilitie: any) => (
            <Card className="my-3" key={`${capabilitie.id}`}>
              <Flex>
                <span className="text">
                  {capabilitie.name} - {capabilitie.type}
                </span>
                <button
                  onClick={() => handleDeleteCapabilitie(capabilitie.id)}
                  className="icon"
                >
                  <ArchiveBoxArrowDownIcon />
                </button>
              </Flex>
            </Card>
          ))}
        </div>
        <div className="  ">
          <h2 className="subtitle py-3">{t("new_capabilitie")} </h2>
          <form
            className="space-y-3"
            onSubmit={handleSubmit(storeNewCapabilitie)}
          >
            <div className="flex flex-col space-y-1">
              <span className="text-content text text-sm">{t("name")}</span>
              <input {...register("name")} type="text" className="input-text" />
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-content text text-sm">{t("type")}</span>
              <select {...register("type")} className="input-text">
                <option value="">-{t("select")}-</option>
                <option value="LIMIT">{t("limit")}</option>
                <option value="PERMISSION">{t("permission")}</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1 mt-3">
              <span className="text-content text text-sm">{t("description")}</span>
              <textarea
                className="input-text"
                placeholder={
                  t("example_create_capabilitie") ?? "Ej. max views per months"
                }
                {...register("description")}
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

export default SuperAdminPlansCapabilities;
