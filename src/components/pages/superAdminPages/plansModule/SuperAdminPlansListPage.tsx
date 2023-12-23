import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  Badge,
} from "@tremor/react";
import SkeltonTable from "../../../components/commons/SkeltonTable";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation, useQuery } from "@apollo/client";

import {
  CONNECT_STRIPE_WITH_PLAN,
  DELETE_PLAN,
  DISCONECT_STRIPE_WITH_PLAN,
  GET_PLANS,
} from "../../../utils/queries";
import { useEffect } from "react";
import {
  ArchiveBoxArrowDownIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { UserMembershipPlanType } from "../../../types/Types";
import Loading from "../../../components/commons/Loading";

const SuperAdminPlansListPage = () => {
  //States
  //Funtions and hooks
  const { t } = useTranslation("superadmin");
  const navigate = useNavigate();
  const {
    data: plans,
    loading,
    refetch,
  } = useQuery(GET_PLANS, {
    onError(error) {
      console.log(error);
    },
  });
  const [deletePlan] = useMutation(DELETE_PLAN);
  const [connectPlan] = useMutation(CONNECT_STRIPE_WITH_PLAN);
  const [disconectPlan] = useMutation(DISCONECT_STRIPE_WITH_PLAN);
  const deletePlanFn = (planId) => {
    toast(t("sure_delete_plan"), {
      action: {
        label: t("delete"),
        onClick: () =>
          deletePlan({
            variables: {
              planId: parseInt(planId),
            },
          })
            .then((r) => {
              toast.success(t("plan_deleted"));
              refetch();
            })
            .catch((e) => toast.error(e.message)),
      },
    });
  };

  const getStripePlanConectionSetting = (settings) => {
    const setting = settings.find((s) => s.settingName === "STRIPE_PLAN_ID");
    if (setting && setting.settingValue) {
      return true;
    } else {
      return false;
    }
  };

  const handleStripeConectionWithPlan = (planId: string) => {
    const promise = () =>
      new Promise((resolve, reject) =>
        connectPlan({
          variables: {
            planId: parseInt(planId),
          },
        })
          .then((r) => {
            resolve("Success");
          })
          .catch((e) => {
            console.log(e);
            toast.error(e.message);
            reject(e.message);
          })
      );

    toast.promise(promise, {
      loading: t("loading"),
      success: (data) => {
        refetch();
        return t("success");
      },
      error: (error) => {
        return error;
      },
    });
  };

  const handleStripeDisconectPlan = (planId: string) => {
    const promise = () =>
      new Promise((resolve, reject) =>
        disconectPlan({
          variables: {
            planId: parseInt(planId),
          },
        })
          .then((r) => {
            resolve("Success");
          })
          .catch((e) => {
            console.log(e);
            toast.error(e.message);
            reject(e.message);
          })
      );

    toast.promise(promise, {
      loading: t("loading"),
      success: (data) => {
        refetch();
        return t("success");
      },
      error: (error) => {
        return error;
      },
    });
  };



  useEffect(() => {
    refetch();
  }, []);

  if(loading){
    return <Loading />
  }

  return (
    <div>
      {loading && <SkeltonTable count={10} />}
      <Table className="mt-6">
        <TableHead>
          <TableRow className="">
            <TableHeaderCell className="text-left">
              {" "}
              {t("name")}
            </TableHeaderCell>
            <TableHeaderCell className="text-center">
              {" "}
              {t("price")}
            </TableHeaderCell>
            <TableHeaderCell className="text-center">
              {" "}
              {t("interval")}{" "}
            </TableHeaderCell>
            <TableHeaderCell className="text-center">
              {t("stripe_plan")}
            </TableHeaderCell>
            <TableHeaderCell className="text-center">
              {t("capabilities")}
            </TableHeaderCell>
            <TableHeaderCell className="text-right">
              {" "}
              {t("actions")}{" "}
            </TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {plans?.getAllPlans?.filter((p) => p.projectId === null).map(
            (item: UserMembershipPlanType, index: number) => (
              <TableRow key={`userP-${item.id + index}`}>
                <TableCell className={`text-center border-l-2 ${item.status === 'ACTIVE' ? "border-green-500" : "border-orange-400"} items-center`}>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="text">{item.name} ({item.group})</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center text">{item.price}</TableCell>
                <TableCell className="text-center text">{item.type}</TableCell>
                <TableCell className="text-center text">
                  {!getStripePlanConectionSetting(item.settings) ? (
                    <button
                      onClick={() => handleStripeConectionWithPlan(item.id)}
                      className="btn-main"
                    >
                      {t("connect_stripe")}
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                    <Badge> {t("connected")} </Badge>{" "}
                    <button
                      onClick={() => handleStripeDisconectPlan(item.id)}
                      className="btn-main"
                    >
                      {t("disconect")}
                    </button>
                  </div>
                  )}
                </TableCell>
                <TableCell className="text-center text">
                  {item.PlanCapabilities?.length}
                </TableCell>
                <TableCell className="justify-end flex space-x-3">
                  <button
                    className="icon "
                    onClick={() => navigate("edit/" + item.id)}
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="icon "
                    onClick={() => deletePlanFn(item.id)}
                  >
                    <ArchiveBoxArrowDownIcon className="h-5 w-5" />
                  </button>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SuperAdminPlansListPage;
