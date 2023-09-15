import React, { Fragment, useRef, useState } from "react";
import NewForm from "../../../../components/commons/NewForm";
import { useMutation, useQuery } from "@apollo/client";

import {
  CREATE_FRONTEND_COMPONENT,
  GET_SUPER_ADMIN_SETTINGS,
} from "../../../../utils/queries";
import { toast } from "sonner";
import {
  parseDataOnSubmit,
} from "../../../../utils/facades/formFacade";
import { useNavigate } from "react-router";

const SuperAdminFrontendNewComponent = ({
  refetch,
}: {
  refetch: () => void;
}) => {
 

  const [createComponent] = useMutation(CREATE_FRONTEND_COMPONENT);
  const { data: getSettings } = useQuery(GET_SUPER_ADMIN_SETTINGS);
  const navigate = useNavigate();
  const formInfo = {
    name: "New component",
    description: "Configure data for your frontend components",
  };

  const [fields, setFields] = useState([
    {
      name: "COMPONENT_NAME",
      label: "Component name",
      type: "text",
      required: false,
    },
  ]);

  const addNewField = (newField: any) => {
    setFields([...fields, newField]);
  };

  const onSubmit = (data: any) => {
    let payload: any = {};
    payload.name = data.COMPONENT_NAME;
    delete data.COMPONENT_NAME;
    payload.data = JSON.stringify(parseDataOnSubmit(data, fields));

    createComponent({
      variables: payload,
    })
      .then((r) => {
        toast.success("Component Added");
        refetch();
        setFields([
          {
            name: "COMPONENT_NAME",
            label: "Component name",
            type: "text",
            required: false,
          },
        ]);
      })
      .catch((e) => {
        console.log(e);
        toast.error("Error");
      });
  };

  return (
    <div>
      <div className="mt-10">
        <NewForm
          values={getSettings?.getSuperAdminSettings}
          info={formInfo}
          fields={fields}
          onSubmit={onSubmit}
          onAddNewField={addNewField}
          newFieldsFunction={true}
        />
      </div>
    </div>
  );
};

export default SuperAdminFrontendNewComponent;
