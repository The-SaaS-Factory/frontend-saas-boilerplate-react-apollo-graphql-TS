import { useEffect, useState } from "react";
import NewForm from "../../../components/commons/NewForm";
import { parseDataOnSubmit } from "../../../utils/facades/formFacade";
import { useMutation, useQuery } from "@apollo/client";
import {
  CONNECT_CAPABILITIE_WITH_PLAN,
  CREATE_PLAN,
  GET_CAPABILITIES,
  GET_PLANS,
} from "../../../utils/queries";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import PageName from "../../../components/commons/PageName";
import Loading from "../../../components/commons/Loading";
import { useTranslation } from "react-i18next";
import {
  UserMembershipPlanCapabilitieType,
  UserMembershipPlanType,
} from "../../../types/Types";

const SuperAdminPlansCreate = () => {
  const { planId } = useParams();
  const { t } = useTranslation("superadmin");

  //States
  const [newDataForCapabilitie, setDataForCapabilitie] = useState(0);
  const [values, setValues] = useState([]);
  const [planOnEdit, setPlanOnEdit] = useState<UserMembershipPlanType | null>(
    null
  );
  const formInfo = {
    name: t("create_plan"),
    description: t("add_plan_description"),
  };

  const fields = [
    {
      name: "name",
      label: t("name"),
      type: "text",
      required: true,
    },
    {
      name: "interval",
      label: t("interval"),
      type: "select",
      required: true,
      options: [
        {
          optionName: t("montly"),
          optionValue: "month", //Don't change, is required for update membershio months in backend with webhook
        },
        {
          optionName: t("quarterly"),
          optionValue: "quarterly", //Don't change, is required for update membershio months in backend with webhook
        },
        {
          optionName: t("semi_annually"),
          optionValue: "semiannually", //Don't change, is required for update membershio months in backend with webhook
        },
        {
          optionName: t("yearly"),
          optionValue: "year", //Don't change, is required for update membershio months in backend with webhook
        },
        {
          optionName: t("lifetime_access"),
          optionValue: "lifetime", //Don't change, is required for update membershio months in backend with webhook
        },
      ],
    },
    {
      name: "price",
      label: t("price"),
      type: "number",
      required: true,
      note: t("price_note"),
    },
    {
      name: "oldPrice",
      label: t("old_price"),
      type: "number",
      required: true,
    },
    {
      name: "status",
      label: t("status"),
      type: "select",
      required: true,
      options: [
        {
          optionName: t("active"),
          optionValue: "ACTIVE",
        },
        {
          optionName: t("inactive"),
          optionValue: "INACTIVE",
        },
      ],
    },
    {
      name: "description",
      label: t("description"),
      type: "textarea",
      required: false,
    },
  ];

  //Funtions and hooks
  const navigate = useNavigate();
  const [savePlan] = useMutation(CREATE_PLAN);
  const [connectCapabilitieWithPlan] = useMutation(
    CONNECT_CAPABILITIE_WITH_PLAN
  );
  const { data: getPlans, loading } = useQuery(GET_PLANS);
  const { data: capabilities } = useQuery(GET_CAPABILITIES);
  const onSubmit = async (data: any) => {
    let payload = await parseDataOnSubmit(data, fields);

    if (planId) {
      payload["planId"] = parseInt(planId);
    }

    savePlan({
      variables: payload,
    })
      .then((r) => {
        toast.success(t("plan_created"));
        navigate("/admin/plans");
      })
      .catch((e) => {
        console.log(e);
        toast.error("Error");
      });
  };

  useEffect(() => {
    const plan = getPlans?.getAllPlans;
     
    
    if (planId && plan && plan.length > 0) {
      const planFound = plan.find((p) => p.id == parseInt(planId));
      if (planFound) {
        setPlanOnEdit(planFound);
        setValues(planFound);
      }
    }
  }, [planId, getPlans]);

  const saveCapabilitieForPlan = (capabilitieId) => {
    if (planOnEdit) {
      const payload = {
        capabilitieId: parseInt(capabilitieId),
        planId: parseInt(planOnEdit.id),
        count: newDataForCapabilitie,
      };

      connectCapabilitieWithPlan({
        variables: payload,
      })
        .then(() => toast.success(t("capabilitie_associate")))
        .catch((e) => toast.error(e.message));
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <PageName
        name={t("manage_plan")}
        breadcrumbs={[
          { name: t("dashboard"), href: "/admin" },
          { name: t("plans"), href: "/admin/plans" },
          { name: t("manage_plan"), href: "#" },
        ]}
      />
      <NewForm
        values={values}
        info={formInfo}
        fields={fields}
        onSubmit={onSubmit}
      />
      <hr className="my-7" />
      {planOnEdit && (
        <div>
          <div className="w-full ">
            <div className="space-y-12">
              <div
                className={`grid   grid-cols-3 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12`}
              >
                <div className="lg:col-span-1">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    {t("capabilities")}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {t("capabilitie_to_plan")}
                  </p>
                </div>

                <div className="lg:col-span-2">
                  {capabilities?.getAllCapabilities.map(
                    (
                      capabilitie: UserMembershipPlanCapabilitieType,
                      index: number
                    ) => (
                      <div key={`capabilitie-${index}`} className="mt-2">
                        <label
                          htmlFor={capabilitie.name}
                          className="block text-sm font-medium leading-6 text"
                        >
                          {capabilitie.name}
                          <span className="text-sky-500 ml-1 font-medium">
                            {" "}
                            {t("current")}:
                          </span>
                          <span className="text-sky-500 ml-1 font-medium">
                            {" "}
                            {capabilitie.type === "LIMIT"
                              ? planOnEdit.PlanCapabilities.find(
                                  (c) => c.capabilitieId == capabilitie.id
                                )?.count ?? "Not set"
                              : ""}
                          </span>
                          <span className="text-sky-500 ml-1 font-medium">
                            {" "}
                            {capabilitie.type === "PERMISSION"
                              ? planOnEdit.PlanCapabilities.find(
                                  (c) => c.capabilitieId == capabilitie.id
                                )?.count ?? null
                                ? "Yes"
                                : "No"
                              : ""}
                          </span>
                        </label>
                        <div className="flex space-x-3 rounded-md      sm:max-w-md">
                          {capabilitie.type === "LIMIT" ? (
                            <input
                              onChange={(e) =>
                                setDataForCapabilitie(parseInt(e.target.value))
                              }
                              min={0}
                              className="input-text"
                              type="number"
                            />
                          ) : (
                            <select
                              onChange={(e) =>
                                setDataForCapabilitie(parseInt(e.target.value))
                              }
                              className="input-text"
                            >
                              <option value="">-{t("change")}:-</option>
                              <option value="1">{t("yes")} </option>
                              <option value="0">{t("no")}</option>
                            </select>
                          )}
                          <button
                            onClick={() =>
                              saveCapabilitieForPlan(capabilitie.id)
                            }
                            className="btn-main"
                          >
                            {t("save")}
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuperAdminPlansCreate;
