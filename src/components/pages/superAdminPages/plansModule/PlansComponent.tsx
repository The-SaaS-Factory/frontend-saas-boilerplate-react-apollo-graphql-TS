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
import { useUser } from "@clerk/clerk-react";
import { getSettingValue } from "@/utils/resorceFacade";
import { classNames } from "@/utils/strFacade";
export type SettingType = {
  settingName: string;
  settingValue: string;
};

const PlansComponent = () => {
  //States
  const [selectMethodModal, setSelectMethodModal] = useState(false);

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
  const { data: plans } = useQuery(GET_PLANS, {
    onError(error) {
      console.log(error);
    },
  });

  //Hooks
  const { user } = useUser();
  const navigate = useNavigate();

  // const stripe =
  //   payments?.find(
  //     (setting: SettingType) =>
  //       setting.settingName === "STRIPE_CLIENT_ENABLED" &&
  //       setting.settingValue === "true"
  //   )?.settingValue ?? null;

  // const paypal =
  //   payments?.find(
  //     (setting: SettingType) =>
  //       setting.settingName === "PAYPAL_CLIENT_ENABLED" &&
  //       setting.settingValue === "true"
  //   )?.settingValue ?? null;

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
    if (!planSelected) {
      toast.error("Select a plan");
    }

    if (planSelected.price === 0) {
      payTierFree({
        variables: {
          planId: parseInt(planSelected.id),
        },
      });
      return;
    }

    if (method === "stripe") {
      createStripeCkeckoutSubscription();
    }
  };

  const createStripeCkeckoutSubscription = () => {
    if (!user) {
      toast.error("User not found");
      return;
    }
    const payload = {
      priceId:
        planSelected.settings.length > 0
          ? planSelected.settings.find(
              (setting: SettingType) => setting.settingName === "STRIPE_PLAN_ID"
            ).settingValue
          : null,
      client_reference_id: parseInt(user.id),
      currency: "usd",
    };

    if (!payload.priceId) {
      toast.error("Stripe plan id not found");
    }

    const url =
      process.env.VITE_SERVER_BASE_URL + "/v1/stripe/create-checkout-session";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((r) => {
        r.json().then((session) => {
          window.location.href = session.url;
        });
      })
      .catch((e) => console.log(e));
  };

  return (
    <div>
      <SelectPaymentMethod
        open={selectMethodModal}
        setOpen={setSelectMethodModal}
        payments={payments}
        pay={processPayment}
      />
      <div className="bg-transparent">
        <section id="ADS" className="g-main p-3 rounded-2xl ">
          <div className="mx-auto mt-16 max-w-7xl px-6   lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <p className="mt-2 mega-title"> Pacote de publicidade </p>
            </div>

            <div className="mt-16 max-w-lg mx-auto ">
              {/* {pricing.frequencies.length > 1 && (
                <div className="flex justify-between items-center">
                  <div>
                    <select
                      onChange={(e) => {
                        const currency = currencies.find(
                          (currency) => currency.id === parseInt(e.target.value)
                        );
                        setCurrencSelected({
                          name: currency.name,
                          rate: currency.rate,
                        });
                      }}
                      className="input-text w-7"
                    >
                      {currencies?.map((currency) => (
                        <option key={currency.id} value={currency.id}>
                          {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
              )}
                </div> */}
            </div>
            <div className="flex flex-col lg:flex-row justify-center space-y-14 lg:space-y-0   lg:space-x-14 my-7 mx-auto">
              {plans?.getAllPlans
                .map((tier: any) => (
                  <div key={tier.id}>
                    <h2
                      id={tier.id}
                      className="text-lg font-semibold leading-8 title"
                    >
                      {tier.name}
                    </h2>
                    <p
                      className="mt-4 text-sm max-w-sm leading-6 subtitle"
                      dangerouslySetInnerHTML={{ __html: tier.description }}
                    ></p>
                    <p className="mt-6 flex items-baseline gap-x-1">
                      <span className="text-4xl font-bold tracking-tight mega-title">
                        € {(tier.price * 1).toLocaleString()}
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
        {plans?.getAllPlans?.filter(
          (plan: any) =>
            plan.group === "MEMBERSHIP" &&
            plan.type === frequency.value &&
            plan.status === "ACTIVE" &&
            plan.projectId === null
        ).length > 0 && (
          <section id="Membership">
            <div className="mx-auto mt-16 max-w-7xl px-6   lg:px-8">
              <div className="mx-auto max-w-4xl text-center">
                <p className="mt-2 mega-title">Pacotes de assinatura</p>
              </div>

              <div className="mt-16 max-w-lg mx-auto ">
                {pricing.frequencies.length > 1 && (
                  <div className="flex justify-between items-center">
                    <div className="w-1/2">
                      <RadioGroup
                        value={frequency}
                        onChange={setFrequency}
                        className="   grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
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
                            <span>{option.label}</span>
                          </RadioGroup.Option>
                        ))}
                      </RadioGroup>
                    </div>
                    <div></div>
                  </div>
                )}
              </div>
              <div className="flex flex-col lg:flex-row justify-center space-y-14 lg:space-y-0   lg:space-x-14 my-7 mx-auto">
                {plans?.getAllPlans
                  ?.filter(
                    (plan: any) =>
                      plan.type === frequency.value &&
                      plan.status === "ACTIVE" &&
                      plan.projectId === null
                  )
                  .map((tier: any) => (
                    <div key={tier.id}>
                      <h2
                        id={tier.id}
                        className="text-lg font-semibold leading-8 title"
                      >
                        {tier.name}
                      </h2>
                      <p
                        className="mt-4 text-sm max-w-sm leading-6 subtitle"
                        dangerouslySetInnerHTML={{ __html: tier.description }}
                      ></p>
                      <p className="mt-6 flex items-baseline gap-x-1">
                        <span className="text-4xl font-bold tracking-tight mega-title">
                          € {(tier.price * 1).toLocaleString()}
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
                          // !token && navigate("/auth/login/login");
                          // if (stripeCheckoutMode === "ELEMENTS") {
                          //   setPlanSelected(tier);
                          //   setOpen(true);
                          // } else {
                          //   createCkeckoutSubscription(tier);
                          // }
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
      {/* 
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

          <div className="fixed inset-0 z-10 overflow-y-auto">
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8     sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckIcon
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base px-16 font-semibold leading-6 text"
                      >
                       Buy {planSelected?.name}, for €
                        {planSelected?.price} <br /> {t("select_payment")}
                      </Dialog.Title>
                      <div className="  flex space-x-3 justify-center my-10">
                        {stripe && (
                          <button
                            onClick={() => createSubscription("stripe")}
                            className="btn-main"
                          >
                            {t("pay_with_stripe")}
                          </button>
                        )}
                        {paypal && <button className="btn-main">PayPal</button>}

                        {!stripe && !paypal && (
                          <span className="text-red-500">
                            {t("no_payment_gateway")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid    sm:gap-3">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root> */}
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
                      Selecione o método de pagamento
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default PlansComponent;
