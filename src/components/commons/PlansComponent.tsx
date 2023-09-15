import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  GET_CURRENCIES,
  GET_PAYMENTS_SETTINGS,
  GET_PLANS,
} from "../../utils/queries";
import { useQuery } from "@apollo/client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "../payments/stripe/StripeCheckoutForm";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getSettingValue } from "../../utils/facades/resorceFacade";
import useFrontendComponent from "../../hooks/useFrontendComponent";
import { CheckBadgeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import Loading from "./Loading";
import { serverURL } from "../../utils/serverUrl";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const PlansComponent = () => {
  const { t } = useTranslation("platform");
  const [open, setOpen] = useState(false);
  const [currencySelected, setCurrencSelected] = useState({
    name: "usd",
    rate: 1,
  });

  const [planSelected, setPlanSelected] = useState<any>(null);
  const [pricing, setPricing] = useState<any>({
    frequencies: [
      { value: "month", label: "Monthly", priceSuffix: "/month" },
      { value: "year", label: "Annually", priceSuffix: "/year" },
    ],
  });

  const { data: getSettings } = useQuery(GET_PAYMENTS_SETTINGS, {
    fetchPolicy: "network-only",
  });
  const { data: currenciesDb } = useQuery(GET_CURRENCIES);
  const { user, token } = useSelector((state: any) => state.auth);
  const [openStripeCheckout, setOpenStripeCheckout] = useState(false);

  const navigate = useNavigate();
  const payments = getSettings?.getPaymentsSettings;
  const stripeMode = getSettingValue(payments, "STRIPE_MODE");
  const stripeCheckoutMode = getSettingValue(payments, "STRIPE_CHECKOUT_MODE");
  const [loading, setLoading] = useState(false);
  const stripePkEnv =
    stripeMode === "test"
      ? "STRIPE_CLIENT_PK_SANDBOX"
      : "STRIPE_CLIENT_PK_PRODUCTION";

  const stripePK = getSettingValue(payments, stripePkEnv);

  const stripePromise: any = loadStripe(stripePK).catch((e) =>
    console.log(e.message)
  );

  const { data: plans } = useQuery(GET_PLANS, {
    onError(error) {
      console.log(error);
    },
  });

  const cancelButtonRef = useRef(null);

  const [frequency, setFrequency] = useState(pricing.frequencies[0]);

  const stripe =
    payments?.find(
      (setting) =>
        setting.settingName === "STRIPE_CLIENT_ENABLED" &&
        setting.settingValue === "true"
    )?.settingValue ?? null;
  const paypal =
    payments?.find(
      (setting) =>
        setting.settingName === "PAYPAL_CLIENT_ENABLED" &&
        setting.settingValue === "true"
    )?.settingValue ?? null;

  const createSubscription = (gateway: string) => {
    setOpenStripeCheckout(true);
  };

  const componentName = "Pricing";
  const { component, loading: loadingComponent } = useFrontendComponent({
    componentName,
  });

  useEffect(() => {
    const types: string[] = Array.from(
      new Set(
        plans?.getAllPlans
          .filter((plan) => plan.status === "ACTIVE")
          .map((plan) => plan.type)
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

  const createCkeckoutSubscription = (tier) => {
    setLoading(true);

    const payload = {
      priceId: tier.settings.find(
        (setting) => setting.settingName === "STRIPE_PLAN_ID"
      ).settingValue,
      client_reference_id: parseInt(user.id),
      currency: currencySelected.name.toLowerCase(),
    };

    const url = serverURL + "/v1/stripe/create-checkout-session";
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
          setLoading(false);
          window.location.href = session.url;
        });
      })
      .catch((e) => console.log(e));
  };

  if (loadingComponent || loading) {
    return <Loading />;
  }

  const currencies = currenciesDb?.getCurrencies;

  return (
    <div>
      <div className="bg-transparent">
        {!component ? (
          <span className="p-7 text-red-500 flex justify-center my-7">
            {componentName} component failed
          </span>
        ) : (
          <section>
            <div className="mx-auto mt-16 max-w-7xl px-6   lg:px-8">
              <div className="mx-auto max-w-4xl text-center">
                <h1 className="text-base font-semibold leading-7 text-indigo-600">
                  {t("pricing")}
                </h1>
                <p className="mt-2 mega-title">{component.title}</p>
              </div>
              <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
                {component.resume}
              </p>
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
                          {t("payment_frequency")}
                        </RadioGroup.Label>
                        {pricing.frequencies.map((option) => (
                          <RadioGroup.Option
                            key={option.value}
                            value={option}
                            className={({ checked }) =>
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
                    <div>
                      <select
                        onChange={(e) => {
                          const currency = currencies.find(
                            (currency) =>
                              currency.id === parseInt(e.target.value)
                          );
                          setCurrencSelected(currency);
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
                  </div>
                )}
              </div>
              <div className="flex flex-col lg:flex-row justify-center space-y-14 lg:space-y-0   lg:space-x-14 my-7 mx-auto">
                {plans?.getAllPlans
                  ?.filter(
                    (plan: any) =>
                      plan.type === frequency.value && plan.status === "ACTIVE"
                  )
                  .map((tier) => (
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
                          ${" "}
                          {(
                            tier.price * currencySelected.rate
                          ).toLocaleString()}
                        </span>
                        <span className="text-sm font-semibold leading-6 text-gray-600">
                          {frequency.priceSuffix}
                        </span>
                      </p>
                      <ul
                        role="list"
                        className="divide-y my-3 space-y-3 divide-gray-100"
                      >
                        {tier.PlanCapabilities.map((capa, index: number) => (
                          <li
                            key={`capa-${index}`}
                            className="items-center flex space-x-3 p-1 text"
                          >
                            {capa.capabilitie.type === "PERMISSION" ? (
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
                            {capa.capabilitie.name}{" "}
                            {capa.capabilitie.type === "LIMIT" && "/ month"}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => {
                          !token && navigate("/auth/login/login");
                          if (stripeCheckoutMode === "ELEMENTS") {
                            setPlanSelected(tier);
                            setOpen(true);
                          } else {
                            createCkeckoutSubscription(tier);
                          }
                        }}
                        className={classNames(
                          tier.mostPopular
                            ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
                            : "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300",
                          "mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        )}
                      >
                        {t("buy_plan")}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}
      </div>

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
                        className="text-base px-16 font-semibold leading-6 text-gray-900"
                      >
                        {t("buy")} {planSelected?.name}, for $
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
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
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
      </Transition.Root>

      <Transition.Root show={openStripeCheckout} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          initialFocus={cancelButtonRef}
          onClose={setOpenStripeCheckout}
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex   items-center justify-center rounded-full  ">
                      <img
                        src="/assets/img/stripe.png"
                        className="w-24 h-auto"
                        alt="Stripe"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      ></Dialog.Title>
                      <div className="  flex space-x-3 justify-center w-full my-10">
                        <div>
                          <Elements stripe={stripePromise}>
                            <StripeCheckoutForm
                              plan={planSelected}
                              billing_details={{
                                name: user.name,
                                email: user.email,
                              }}
                            />
                          </Elements>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense   sm:gap-3">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={() => setOpenStripeCheckout(false)}
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
      </Transition.Root>
    </div>
  );
};

export default PlansComponent;
