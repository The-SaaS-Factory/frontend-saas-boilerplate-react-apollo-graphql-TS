/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  Badge,
} from "@tremor/react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation, useQuery } from "@apollo/client";

import { useEffect } from "react";
import {
  ArchiveBoxArrowDownIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import {
  CONNECT_STRIPE_WITH_PLAN,
  DELETE_PLAN,
  DISCONECT_STRIPE_WITH_PLAN,
  GET_PLANS,
} from "./plansGraphql";
import PageLoader from "@/components/ui/loaders/PageLoader";
import SkeltonTable from "@/components/ui/loaders/SkeltonTable";
import { UserMembershipPlanType } from "./plansTypes";
import { handleRequestError } from "@/utils/facades/handleRequestError";

const SuperAdminPlansListPage = () => {
  //States
  //Funtions and hooks
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
  const deletePlanFn = (planId: string) => {
    toast("Are you sure?", {
      action: {
        label: "Delete",
        onClick: () =>
          deletePlan({
            variables: {
              planId: parseInt(planId),
            },
          })
            .then(() => {
              toast.success("Plan deleted successfully");
              refetch();
            })
            .catch((e) => toast.error(e.message)),
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
        },
      },
    });
  };

  const getStripePlanConectionSetting = (settings: any) => {
    const setting = settings.find(
      (s: any) => s.settingName === "STRIPE_PLAN_ID"
    );
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
          .then(() => {
            resolve("Success");
          })
          .catch((e) => {
            handleRequestError(e);
            reject(e.message);
          })
      );

    toast.promise(promise, {
      loading: "Loading",
      success: () => {
        refetch();
        return "Success";
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
          .then(() => {
            resolve("Success");
          })
          .catch((e) => {
            console.log(e);
            toast.error(e.message);
            reject(e.message);
          })
      );

    toast.promise(promise, {
      loading: "Loading",
      success: () => {
        refetch();
        return "Success";
      },
      error: (error) => {
        return error;
      },
    });
  };

  useEffect(() => {
    refetch();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div>
      {loading && <SkeltonTable count={10} />}
      <Table className="mt-6">
        <TableHead>
          <TableRow className="">
            <TableHeaderCell className="text-left">Name</TableHeaderCell>
            <TableHeaderCell className="text-center">Price</TableHeaderCell>
            <TableHeaderCell className="text-center">Interval</TableHeaderCell>
            <TableHeaderCell className="text-center">
              Stripe Conection
            </TableHeaderCell>
            <TableHeaderCell className="text-center">
              Capabilities
            </TableHeaderCell>
            <TableHeaderCell className="text-right">Actions</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {plans?.getAllPlans.map(
            (item: UserMembershipPlanType, index: number) => (
              <TableRow key={`userP-${item.id + index}`}>
                <TableCell
                  className={`text-center border-l-2 ${
                    item.status === "ACTIVE"
                      ? "border-green-500"
                      : "border-orange-400"
                  } items-center`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="text">{item.name}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center font-medium text">
                  $ {Number(item.price).toFixed(2)}
                </TableCell>
                <TableCell className="text-center text">{item.type}</TableCell>
                <TableCell className="text-center text flex  ">
                  {!getStripePlanConectionSetting(item.settings) ? (
                    <button
                      onClick={() => handleStripeConectionWithPlan(item.id)}
                      className="btn-main"
                    >
                      Connect Stripe
                    </button>
                  ) : (
                    <div className="flex space-x-3  items-center">
                      <Badge> Conected </Badge>{" "}
                      <button
                        onClick={() => handleStripeDisconectPlan(item.id)}
                        className="btn-main"
                      >
                        Disconect
                      </button>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center text">
                  {item.PlanCapabilities?.length}
                </TableCell>
                <TableCell className="justify-end flex space-x-3">
                  <button
                    className="btn-icon "
                    onClick={() => navigate("edit/" + item.id)}
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="btn-icon "
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
