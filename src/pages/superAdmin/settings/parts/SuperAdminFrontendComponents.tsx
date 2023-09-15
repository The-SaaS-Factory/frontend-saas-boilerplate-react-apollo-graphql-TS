import { Badge, Card, Flex } from "@tremor/react";
import { Fragment, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_FRONTEND_COMPONENT } from "../../../../utils/queries";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "sonner";
import NewForm from "../../../../components/commons/NewForm";
import {
  ArchiveBoxArrowDownIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const SuperAdminFrontendComponents = ({ components, refetch }) => {
  const { t } = useTranslation("superadmin");
  const [open, setOpen] = useState(false);
  const [componentToEdit, setComponentToEdit] = useState<any>(null);
  const cancelButtonRef = useRef(null);

  const [fields, setFields] = useState<any>([]);
  const [createComponent] = useMutation(CREATE_FRONTEND_COMPONENT);

  const handleEditComponent = (component: any) => {
    const data = JSON.parse(component.data);
    const keys = Object.keys(data);
    let fieldsPayload: any = [];
    keys.map((key: string) => {
      let type = "text";
      if (key.endsWith("list")) {
        type = "list";
      }

      let label = key.replace("list", "");

      fieldsPayload.push({ name: key, label: label, type });
    });
    setFields(fieldsPayload);
    setComponentToEdit(component);
    setOpen(!open);
  };
  const handleDeleteComponent = (component: any) => {
    createComponent({
      variables: {
        id: parseInt(component.id),
        action: "DELETE",
      },
    })
      .then((r) => {
        toast.success(t("component_deleted"));
        refetch();
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  const onSubmit = (data: any) => {
    let payload: any = {};
    payload.id = parseInt(componentToEdit.id);
    payload.name = componentToEdit.name;
    payload.data = JSON.stringify(data);

    createComponent({
      variables: payload,
    })
      .then((r) => {
        toast.success(t("component_updated"));
        setOpen(!open);
        refetch();
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  const addNewField = (newField: any) => {
    setFields([...fields, newField]);
  };

  //#Fix add warning for more than 2 components with some name.. issue pisma
  return (
    <div>
      {components?.getFrontendComponents.map(
        (component: any, index: number) => {
          return (
            <div key={`component-${index}`} className="mt-5">
              <Card>
                <Flex>
                  <div className="flex   flex-col">
                    <div className="flex space-x-2 ">
                      <span className="font-bold text">
                        {component.name} - {component.Language?.name}
                      </span>
                      {component.type === "DEFAULT" && <Badge>default</Badge>}
                    </div>
                    <code className="py-3 "> {component.description}</code>
                  </div>
                  <div className="flex space-x-3 items-center">
                    <button
                      className="icon"
                      onClick={() => handleEditComponent(component)}
                    >
                      <Cog6ToothIcon />
                    </button>
                    {component.type != "DEFAULT" && (
                      <button
                        className="icon"
                        onClick={() => handleDeleteComponent(component)}
                      >
                        <ArchiveBoxArrowDownIcon />
                      </button>
                    )}
                  </div>
                </Flex>
              </Card>
            </div>
          );
        }
      )}

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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        {t("component_edit")}
                      </Dialog.Title>
                      <div className="  flex space-x-3 justify-center my-10">
                        <NewForm
                          values={
                            componentToEdit && JSON.parse(componentToEdit.data)
                          }
                          info={null}
                          fields={fields}
                          onSubmit={onSubmit}
                          newFieldsFunction={true}
                          onAddNewField={addNewField}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense   sm:gap-3">
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
    </div>
  );
};

export default SuperAdminFrontendComponents;
