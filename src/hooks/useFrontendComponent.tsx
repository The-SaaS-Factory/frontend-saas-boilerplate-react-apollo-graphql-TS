import { useQuery } from "@apollo/client";
import { GET_FRONTEND_COMPONENTS } from "../utils/queries";
import i18n from "../utils/i18n";

const useFrontendComponent = ({ componentName }) => {
  const lng = i18n.language;
  const { data, loading } = useQuery(GET_FRONTEND_COMPONENTS, {
    variables: {
      name: componentName,
      language: lng,
    },
    onError(error) {
      console.log(error);
    },
  });

  const component: any =
    data?.getFrontendComponents.length > 0 &&
    JSON.parse(data?.getFrontendComponents[0]?.data);

  return {
    component,
    loading,
  };
};

export default useFrontendComponent;
