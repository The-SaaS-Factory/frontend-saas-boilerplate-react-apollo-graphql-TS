/* eslint-disable @typescript-eslint/no-explicit-any */
import { RadioGroup } from "@headlessui/react";

import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { useMutation, useQuery } from "@apollo/client";

import { useNavigate } from "react-router";
import {
  CheckBadgeIcon,
  CreditCardIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { toast } from "sonner";
import {
  BUY_PLAN_FREE,
  GET_PAYMENTS_SETTINGS,
  GET_PLANS,
} from "./plansGraphql";
import { useOrganization, useUser } from "@clerk/clerk-react";
import { getSettingValue } from "@/utils/facades/resorceFacade";
import { classNames } from "@/utils/facades/strFacade";
import { Link } from "react-router-dom";
import { systemScope } from "@/utils/constants/globalContants";
import SkeletonTable from "@/components/ui/loaders/SkeltonTable";
import PageLoader from "@/components/ui/loaders/PageLoader";
import { handleRequestError } from "@/utils/facades/handleRequestError";
export type SettingType = {
  settingName: string;
  settingValue: string;
};

const PlansComponent = () => {
  //States
  const { organization } = useOrganization();
  const [selectMethodModal, setSelectMethodModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [planSelected, setPlanSelected] = useState<any>(null);
  const [pricing, setPricing] = useState<any>({
    frequencies: [
      { value: "month", label: "Monthly", priceSuffix: "/month" },
      { value: "year", label: "Annually", priceSuffix: "/year" },
    ],
  });
  const [frequency, setFrequency] = useState(pricing.frequencies[0]);

  //Queries and mutations
  const { data: getSettings } = useQuery(GET_PAYMENTS_SETTINGS, {
    fetchPolicy: "network-only",
  });
  const payments = getSettings?.getPaymentsSettings;
  const { data: plans, loading: loadingPlans } = useQuery(GET_PLANS, {
    onError(error) {
      console.log(error);
    },
  });

  //Hooks
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const types: string[] = Array.from(
      new Set(
        plans?.getAllPlans
          .filter((plan: any) => plan.status === "ACTIVE")
          .map((plan: any) => plan.type)
      )
    );

    if (types.length > 0) {
      //#Fix types
      const formattedTypes: any = types.map((typeName) => ({
        value: typeName,
        label: typeName.charAt(0).toUpperCase() + typeName.slice(1),
        priceSuffix: `/${typeName}`,
      }));

      setPricing({
        frequencies: [...formattedTypes],
      });

      setFrequency(formattedTypes[0]);
    }
  }, [plans]);

  const [payTierFree] = useMutation(BUY_PLAN_FREE, {
    onCompleted() {
      navigate("/home/billing/subscriptions/paymentCompleted");
      toast.success("Plan purchased successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const processPayment = (method: string) => {
    setLoading(true);

    if (!planSelected) {
      toast.error("Select a plan");
      setLoading(false);
      return;
    }

    if (planSelected.price === 0) {
      payTierFree({
        variables: {
          planId: parseInt(planSelected.id),
        },
      });
      setLoading(false);
      return;
    }

    if (method === "stripe") {
      createStripeCkeckoutSubscription();
    }
  };

  const createStripeCkeckoutSubscription = () => {
    if (systemScope && systemScope === "personal" && !user) {
      toast.error("User not found");
      setLoading(false);
      return;
    }
    if (systemScope && systemScope === "organization" && !organization) {
      toast.error("Organization not found");
      setLoading(false);
      return;
    }

    const payload = {
      priceId:
        planSelected.settings.length > 0
          ? planSelected.settings.find(
              (setting: SettingType) => setting.settingName === "STRIPE_PLAN_ID"
            ).settingValue
          : null,
      client_reference_id:
        systemScope && systemScope === "organization"
          ? `O-${organization?.id}`
          : `U-${user?.id}`,
      currency: "brl", //Fix: get from settings
    };

    if (!payload.priceId) {
      setLoading(false);
      toast.error("Stripe plan id not found");
    }
    const serverURL = import.meta.env.VITE_SERVER_BASE_URL;

    const url = serverURL + "/api/v1/stripe/create-checkout-session";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((r) => {
        console.log(r);

        r.json().then((session) => {
          window.location.href = session.url;
        });
      })
      .catch((e) => {
        setLoading(false);
        handleRequestError(e);
      });
  };

  const parseFrequencyName = (name: string) => {
    if (name === "Year") {
      return "Annually";
    }

    return name;
  };

  if (loadingPlans) return <SkeletonTable count={10} />;
  if (loading) return <PageLoader />;

  return (
    <div>
      <SelectPaymentMethod
        open={selectMethodModal}
        setOpen={setSelectMethodModal}
        payments={payments}
        pay={processPayment}
      />
      <div className="bg-transparent">
        {plans?.getAllPlans?.filter(
          (plan: any) =>
            plan.type === frequency.value && plan.status === "ACTIVE"
        ).length > 0 && (
          <section id="Membership">
            <div className="mx-auto flex flex-col mt-16 max-w-7xl px-6   lg:px-8">
              <div className="mx-auto max-w-4xl sm:text-center">
                <h2 className="text-base font-semibold leading-7 text-indigo-600">
                  Pricing
                </h2>
                <p className="mt-2 mega-title">
                  Choose the right plan for&nbsp;you
                </p>
              </div>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-center">
                Distinctio et nulla eum soluta et neque labore quibusdam. Saepe
                et quasi iusto modi velit ut non voluptas in. Explicabo id ut
                laborum.
              </p>
              <div className="flex w-full mt-16 max-w-lg mx-auto ">
                {pricing.frequencies.length > 1 && (
                  <div className="  w-full mx-auto   items-center">
                    <div className=" ">
                      <RadioGroup
                        value={frequency}
                        onChange={setFrequency}
                        className="   grid grid-cols-3 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
                      >
                        <RadioGroup.Label className="sr-only">
                          Payment frequency
                        </RadioGroup.Label>
                        {pricing.frequencies.map((option: any) => (
                          <RadioGroup.Option
                            key={option.value}
                            value={option}
                            className={() =>
                              classNames(
                                frequency.value === option.value
                                  ? "bg-indigo-600 text-white"
                                  : "text-gray-500",
                                "cursor-pointer rounded-full px-2.5 py-1"
                              )
                            }
                          >
                            <span>{parseFrequencyName(option.label)}</span>
                          </RadioGroup.Option>
                        ))}
                      </RadioGroup>
                    </div>
                    <div></div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 p-3 mt-7 md:gridcols-2 lg:grid-cols-3 gap-4">
                {plans?.getAllPlans
                  ?.filter(
                    (plan: any) =>
                      plan.type === frequency.value && plan.status === "ACTIVE"
                  )
                  .map((tier: any) => (
                    <div
                      key={tier.id}
                      className="border border-gray-200 rounded-2xl p-7"
                    >
                      <h2
                        id={tier.id}
                        className="text-lg font-semibold leading-8 title"
                      >
                        {tier.name}
                      </h2>
                      <div
                        className="mt-4 magic-link  text-sm max-w-sm leading-6 subtitle"
                        dangerouslySetInnerHTML={{ __html: tier.description }}
                      ></div>
                      <p className="mt-6 flex items-baseline gap-x-1">
                        <span className="text-4xl font-bold tracking-tight mega-title">
                          $ {(tier.price * 1).toLocaleString()}
                        </span>
                        <span className="text-sm font-semibold leading-6 text-gray-600">
                          {frequency.priceSuffix}
                        </span>
                      </p>
                      <ul
                        role="list"
                        className="divide-y my-3 space-y-3 divide-gray-100"
                      >
                        {tier.PlanCapabilities?.map(
                          (capa: any, index: number) => {
                            return (
                              <li
                                key={`capa-${index}`}
                                className="items-center flex space-x-3 p-1 text"
                              >
                                {capa.capabilitie?.type === "PERMISSION" ? (
                                  capa.count == 1 ? (
                                    <button className="icon mr-2">
                                      {" "}
                                      <CheckBadgeIcon />{" "}
                                    </button>
                                  ) : (
                                    <button className="icon mr-2">
                                      {" "}
                                      <XMarkIcon />
                                    </button>
                                  )
                                ) : (
                                  capa.count
                                )}{" "}
                                {capa.name} {capa.type === "LIMIT" && "/ month"}
                              </li>
                            );
                          }
                        )}
                      </ul>

                      <button
                        onClick={() => {
                          setPlanSelected(tier);
                          setSelectMethodModal(true);
                        }}
                        className={classNames(
                          tier.mostPopular
                            ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
                            : "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300",
                          "mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        )}
                      >
                        Buy plan
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export function SelectPaymentMethod({
  open,
  setOpen,
  payments,
  pay,
}: {
  open: boolean;
  setOpen: (data: boolean) => void;
  payments: any;
  pay: any;
}) {
  const { user } = useUser();
  const stripeEnabled = getSettingValue(payments, "STRIPE_CLIENT_ENABLED");
  const cancelButtonRef = useRef(null);
  const [step, setStep] = useState(1);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className="relative transform   overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
                style={{ width: "100%" }}
              >
                {user ? (
                  <>
                    <div>
                      <div className="flex justify-evenly">
                        <button
                          onClick={() => setStep(1)}
                          className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full
                     ${step === 1 ? "bg-green-100" : "bg-gray-100"}`}
                        >
                          <CreditCardIcon className="h-7 w-7 text-gray-500" />
                        </button>
                      </div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text"
                        >
                          Select payment method
                        </Dialog.Title>
                      </div>
                    </div>
                    <div className="flex flex-col mt-14 space-y-3">
                      {stripeEnabled && (
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                          onClick={() => {
                            pay("stripe");
                          }}
                        >
                          Pay with Debit / Credit Card by{" "}
                          <img
                            src="/assets/img/stripe.png"
                            className=" ml-3 h-5  w-auto"
                            alt=""
                          />
                        </button>
                      )}

                      <br />
                      <button
                        type="button"
                        className="mt-7 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col  space-y-7">
                    <h2 className="title text-center pt-7">
                      You must be logged in to buy a plan
                    </h2>
                    <Link to={"/home"} className="btn-main mx-auto">
                      Log in
                    </Link>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default PlansComponent;
