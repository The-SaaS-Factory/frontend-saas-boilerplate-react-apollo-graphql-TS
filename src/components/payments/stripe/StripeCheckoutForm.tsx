import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button, TextInput } from "@tremor/react";
import React, { useEffect, useState } from "react";
import { serverURL } from "../../../utils/serverUrl";
import { useMutation } from "@apollo/client";
import { BUY_PLAN_WITH_STRIPE } from "../../../utils/queries";
import { toast } from "sonner";
import Loading from "../../commons/Loading";
import { useNavigate } from "react-router";

function StripeCheckoutForm({ billing_details, plan }) {
  const [buyPlanWithStripe] = useMutation(BUY_PLAN_WITH_STRIPE);

  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const createSubscription = async () => {
    setLoading(true);
    const paymentMethod = await stripe
      ?.createPaymentMethod({
        type: "card",
        card: elements?.getElement(CardElement)!,
        billing_details,
      })
      .catch((e) => {
        toast.error(e.error.message);
        return;
      });

    if (paymentMethod && paymentMethod.error) {
      setLoading(false);
      return toast(paymentMethod.error.message);
    }

    const payload = {
      gateway: "stripe",
      gatewayPayload: paymentMethod?.paymentMethod?.id,
      planId: parseInt(plan.id),
    };

    buyPlanWithStripe({
      variables: payload,
    })
      .then((r: any) => {
        console.log(r);
        
        setLoading(false);
        const confirmPayment = stripe
          ?.confirmCardPayment(r.data.buyPlanWithStripe.clientSecret)
          .then((e) => {
            toast.success("Payment Completed");
            navigate("/home/billing/subscriptions/paymentCompleted", {
              replace: true,
            });
          })
          .catch((e) => toast.error(e.message));
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
        toast.error(e.message);
      });
  };

  return (
    <>
      {loading && <Loading />}
      <div className="flex flex-col w-full  ">
        <div className="  bg-gray-100 p-3 rounded-xl w-80  lg:w-96">
          <CardElement />
        </div>
        <button
          className="btn-main my-7"
          onClick={createSubscription}
          disabled={!stripe}
        >
          Subscribe
        </button>
      </div>
    </>
  );
}

export default StripeCheckoutForm;
