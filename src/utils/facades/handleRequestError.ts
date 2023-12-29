import { toast } from "sonner";
import { handleGraphqlErrorFacade } from "../graphql/handleGraphqlErrorFacade";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleRequestError = (error: any) => {
  if (error.graphQLErrors) {
    handleGraphqlErrorFacade(error.graphQLErrors);
  }
  if (error.networkError) {
    toast.error(`Network error: ${error.networkError.message}`);
  } else {
    toast.error(error.message || "Something went wrong");
  }
};
