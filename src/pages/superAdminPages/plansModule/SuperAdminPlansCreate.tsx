/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import {
  UserMembershipPlanCapabilitieType,
  UserMembershipPlanType,
} from "./plansTypes";
import {
  CONNECT_CAPABILITIE_WITH_PLAN,
  CREATE_PLAN,
  GET_CAPABILITIES,
  GET_PLANS,
} from "./plansGraphql";
import NewForm, { parseDataOnSubmit } from "@/components/core/NewForm";
import PageName from "@/components/ui/commons/PageName";
import PageLoader from "@/components/ui/loaders/PageLoader";
import { Select, SelectItem, TextInput } from "@tremor/react";
import { handleRequestError } from "@/utils/facades/handleRequestError";

const SuperAdminPlansCreate = () => {
  const { planId } = useParams();

  //States
  const [newDataForCapabilitie, setDataForCapabilitie] = useState(0);
  const [values, setValues] = useState([]);
  const [planOnEdit, setPlanOnEdit] = useState<UserMembershipPlanType | null>(
    null
  );
  const formInfo = {
    name: "Create Plan",
    description: "Create a new plan for your organization",
  };

  const fields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "type",
      label: "Interval",
      type: "select",
      required: true,
      options: [
        {
          optionName: "Monthly",
          optionValue: "month", //Don't change, is required for update membershio months in backend with webhook
        },
        {
          optionName: "Quarterly",
          optionValue: "quarterly", //Don't change, is required for update membershio months in backend with webhook
        },
        {
          optionName: "Semiannually",
          optionValue: "semiannually", //Don't change, is required for update membershio months in backend with webhook
        },
        {
          optionName: "Annually",
          optionValue: "year", //Don't change, is required for update membershio months in backend with webhook
        },
        {
          optionName: "Lifetime",
          optionValue: "lifetime", //Don't change, is required for update membershio months in backend with webhook
        },
      ],
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      required: true,
      note: "Price in USD",
    },
    {
      name: "oldPrice",
      label: "Old Price",
      type: "number",
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        {
          optionName: "Active",
          optionValue: "ACTIVE",
        },
        {
          optionName: "Inactive",
          optionValue: "INACTIVE",
        },
      ],
    },
    {
      name: "description",
      label: "Description",
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

  const onSubmit = async (data: unknown) => {
    const payload: any = await parseDataOnSubmit(data, fields);

    if (planId) {
      payload["planId"] = parseInt(planId);
    }
    savePlan({
      variables: payload,
    })
      .then(() => {
        toast.success("Plan created successfully");

        navigate("/admin/billing");
      })
      .catch((e) => {
        handleRequestError(e);
      });
  };

  useEffect(() => {
    const plan = getPlans?.getAllPlans;

    if (planId && plan && plan.length > 0) {
      const planFound = plan.find((p: any) => p.id == parseInt(planId));
      if (planFound) {
        setPlanOnEdit(planFound);
        setValues(planFound);
      }
    }
  }, [planId, getPlans]);

  const saveCapabilitieForPlan = (capabilitieId: any, capabilitieName: any) => {
    if (planOnEdit) {
      const payload = {
        capabilitieId: parseInt(capabilitieId),
        planId: parseInt(planOnEdit.id),
        count: newDataForCapabilitie,
        name: capabilitieName,
      };

      connectCapabilitieWithPlan({
        variables: payload,
      })
        .then(() => toast.success("Capabilitie saved"))
        .catch((e) => toast.error(e.message));
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <PageName
        name="Manage Plan"
        breadcrumbs={[
          { name: "Dashboard", href: "/admin" },
          { name: "Billing", href: "/admin/billing" },
          { name: "Manage Plan", href: "#" },
        ]}
      />
      <NewForm
        values={values}
        info={formInfo}
        fields={fields}
        onSubmit={onSubmit}
      />

      {planOnEdit && (
        <div>
          <div className="w-full ">
            <div className="space-y-12">
              <div
                className={`grid   grid-cols-3 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12`}
              >
                <div className="lg:col-span-1 p-7">
                  <h2 className="text-subtitle">Capabilities</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {" "}
                    Set the capabilities for this plan
                  </p>
                </div>

                <div className="lg:col-span-2">
                  {capabilities?.getAllCapabilities
                    .filter((c: any) => c.group === planOnEdit.group)
                    .map(
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
                              Current
                            </span>
                            <span className="text-sky-500 ml-1 font-medium">
                              {" "}
                              {capabilitie.type === "LIMIT" ||
                              capabilitie.type === "AMOUNT"
                                ? planOnEdit.PlanCapabilities?.find(
                                    (c) => c.capabilitieId == capabilitie.id
                                  )?.count ?? "Not set"
                                : ""}
                            </span>
                            <span className="text-sky-500 ml-1 font-medium">
                              {" "}
                              {capabilitie.type === "PERMISSION"
                                ? planOnEdit.PlanCapabilities?.find(
                                    (c) => c.capabilitieId == capabilitie.id
                                  )?.count ?? null
                                  ? "Yes"
                                  : "No"
                                : ""}
                            </span>
                          </label>
                          <div className="flex space-x-3 rounded-md      sm:max-w-md">
                            {capabilitie.type === "LIMIT" ||
                            capabilitie.type === "AMOUNT" ? (
                              <TextInput
                                onValueChange={(value) =>
                                  setDataForCapabilitie(parseInt(value))
                                }
                                min={0}
                                className="input-text"
                              />
                            ) : (
                              <Select
                                onValueChange={(value) =>
                                  setDataForCapabilitie(parseInt(value))
                                }
                                className="input-text"
                              >
                                <SelectItem value="">-Change-</SelectItem>
                                <SelectItem value="1">Yes </SelectItem>
                                <SelectItem value="0">No</SelectItem>
                              </Select>
                            )}
                            <button
                              onClick={() =>
                                saveCapabilitieForPlan(
                                  capabilitie.id,
                                  capabilitie.name
                                )
                              }
                              className="btn-main"
                            >
                              Save
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
