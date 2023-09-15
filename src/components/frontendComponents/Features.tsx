import { useQuery } from "@apollo/client";
import React from "react";
import { GET_FRONTEND_COMPONENTS } from "../../utils/queries";
import i18n from "../../utils/i18n";
const Features = () => {
  3;
  const componentName = "Features";
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

  const component =
    data?.getFrontendComponents.length > 0 &&
    JSON.parse(data?.getFrontendComponents[0]?.data);

  console.log(component);

  return (
    <div>
      {!component && !loading ? (
        <span className="p-7 text-red-500 flex justify-center my-7">
          {componentName} component failed
        </span>
      ) : (
        <div className="bg-white py-7 sm:py-7">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {component.title}
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                {component.resume}
              </p>
            </div>

            <div  className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {component.featureslist?.map((feature: any) => (
                  <div key={feature.Name} className="flex flex-col">
                    <dt className="text-base font-semibold leading-7 text-gray-900">
                      {feature.Name}
                    </dt>
                    <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                      <p className="flex-auto">{feature.Description}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Features;
