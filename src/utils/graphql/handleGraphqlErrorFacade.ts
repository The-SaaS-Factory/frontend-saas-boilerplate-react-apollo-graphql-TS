import { GraphQLError } from "graphql";
import { toast } from "sonner";

export const handleGraphqlErrorFacade = (errors: GraphQLError[]) => {
  errors.forEach((error) => {
    toast.error(error.message);
  });
};

