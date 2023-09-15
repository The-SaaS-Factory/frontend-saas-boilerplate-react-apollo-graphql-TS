import React, { useEffect, useState } from "react";
import { GET_CURRENT_USER } from "../utils/queries";
import { useLazyQuery, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const useCheckMembership = () => {
  const navigate = useNavigate();


  const { data } = useQuery(GET_CURRENT_USER, {
    onCompleted(data) {
      console.log(data.me.Membership.length);

      if (data && data.me.Membership.length === 0) {
        toast.error("Need to update plan");
        navigate("/home/billing/subscriptions");
      }
    },
    onError(error) {
      console.log(error);
    },
  });

  console.log(data);
};

export default useCheckMembership;
