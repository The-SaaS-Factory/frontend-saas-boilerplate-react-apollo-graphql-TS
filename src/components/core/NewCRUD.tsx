/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { EyeIcon } from "@heroicons/react/24/outline";
import NewForm, { parseDataOnSubmit } from "./NewForm";
import { toast } from "sonner";
import PageName from "../ui/commons/PageName";
import { formatTimestampToDateString } from "@/utils/facades/strFacade";
import SkeletonTable from "../ui/commons/SkeltonTable";
import { handleRequestError } from "@/utils/facades/handleRequestError";

export const getBadgeClass = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "badge-green";
    case "INACTIVE":
      return "badge-red";
    case "PENDING":
      return "badge-orange";
    case "SENT":
      return "badge-orange";
    case "PAID":
      return "badge-green";
    case "COMPLETED":
      return "badge-sky";
    default:
      return "badge-gray";
  }
};

export const getStatusName = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "Activo";
    case "INACTIVE":
      return "Inactivo";
    case "PENDING":
      return "Pendiente";
    case "SENT":
      return "Enviado";
    case "PAID":
      return "Pagado";
    case "COMPLETED":
      return "Completado";
    default:
      return "Sin definir";
  }
};

export interface CRUDSettingInterface {
  settings: {
    model: string;
    extraModules?: any[];
    theme?: ThemeType;
    fields: FieldType[];
    list: ListType;
    edit?: EditType;
    delete?: DeleteType;
    create?: CreateType;
    view?: ViewType;
  };
}

type ThemeType = {
  header: {
    breadcrumbs: boolean;
  };
};

type FieldType = {
  label: string;
  name: string;
  nameForList?: string;
  type: FieldTypeType;
  forceParseInt?: boolean;
  required?: boolean;
  columnFormater?: (value: string) => any;
  list?: {
    disabled: boolean;
  };
};

export enum FieldTypeType {
  text = "text",
  date = "date",
  select = "select",
  number = "number",
  textarea = "textarea",
  gallery = "gallery",
  link = "link",
  customList = "customList",
}

type ListType = {
  queryList: any;
  queryListName: string;
};

type DeleteType = {
  mutationDelete?: any;
  mutationDeleteName?: string;
};

type CreateType = {
  mutationCreate?: any;
  mutationCreateName?: string;
};

type ViewType = {
  disabled: boolean;
};

type EditType = {
  disabled: boolean;
};

const defaultMutation = gql`
  mutation DefaultMutation {
    placeholderMutation {
      id
    }
  }
`;

const NewCRUD = ({ settings }: CRUDSettingInterface) => {
  //States and globals
  const [openCreate, setOpenCreate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [valuesToEdit, setValuesToEdit] = useState<any>([]);
  const [valuesToView, setValuesToView] = useState<any>([]);
  const cancelButtonRef = useRef(null);

  //Queries and Mutations
  const { data: dataDb, loading } = useQuery(settings.list.queryList);
  const data = dataDb ? dataDb[settings.list.queryListName] : [];
  const [deleteItem] = useMutation(
    settings.delete?.mutationDelete ?? defaultMutation
  );
  const getCreateMutation: any = () => {
    if (settings.create?.mutationCreate) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useMutation(settings.create.mutationCreate ?? defaultMutation);
    } else {
      return [
        () => {
          console.log("Create operation not defined");
        },
      ];
    }
  };

  const [createItem] = getCreateMutation();

  //Functions
  const handleDeleteItem = (id: string) => {
    toast("Are you sure?", {
      action: {
        label: "Remove item",
        onClick: () => {
          toast.promise(
            deleteItem({
              variables: {
                id: typeof id === "string" ? parseInt(id) : id,
              },
              refetchQueries: [
                {
                  query: settings.list.queryList,
                },
              ],
            })
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                handleRequestError(err);
              }),
            {
              loading: "Loading...",
              success: () => {
                return `Item deleted `;
              },
              error: "Error",
            }
          );
        },
      },
    });
  };

  const handleOnSubmitCreate = async (values: any) => {
    const payload: any = await parseDataOnSubmit(values, settings.fields);

    //If is edit, add id to payload, is update operation
    if (valuesToEdit.id) {
      payload.modelId =
        typeof valuesToEdit.id === "string"
          ? parseInt(valuesToEdit.id)
          : valuesToEdit.id;
    }

    createItem({
      variables: payload,
      refetchQueries: [
        {
          query: settings.list.queryList,
        },
      ],
    })
      .then(() => {
        setOpenCreate(false);
      })
      .catch((err: any) => {
        handleRequestError(err);
      });
  };

  const getNestedValue = (obj: any, path: any) => {
    const pathParts = path.split(".");

    const recursiveExtract: any = (currentObject: any, remainingPath: any) => {
      if (!currentObject || remainingPath.length === 0) {
        return currentObject;
      }

      const currentPath = remainingPath[0];
      const nextObject = currentObject[currentPath];

      if (Array.isArray(nextObject)) {
        return nextObject
          .map((item) => recursiveExtract(item, remainingPath.slice(1)))
          .filter((item) => item !== undefined) // Filtra los elementos indefinidos
          .join(", ");
      } else {
        return recursiveExtract(nextObject, remainingPath.slice(1));
      }
    };

    const outputData = recursiveExtract(obj, pathParts);

    if (path.includes("status")) {
      return (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeClass(
            outputData
          )}`}
        >
          {getStatusName(outputData)}
        </span>
      );
    } else {
      return outputData;
    }
  };

  const parseFinalValue = (column: FieldType, value: any) => {
    if (column.type === FieldTypeType.text) {
      return <TextItem column={column} value={value} />;
    }

    if (column.type === FieldTypeType.number && column.forceParseInt) {
      return parseInt(value);
    }

    if (column.type === FieldTypeType.date) {
      return <TextDate value={value} />;
    }
    if (column.type === FieldTypeType.link) {
      return <TextLink value={value} />;
    }
  };

  return (
    <div>
      <PageName
        name={`Admin ${settings.model}`}
        breadcrumbs={
          settings.theme?.header?.breadcrumbs
            ? [
                { name: "Dashboard", href: "/admin" },
                {
                  name: `${settings.model}`,
                  href: `/admin/${settings.model}`,
                },
                { name: `Admin ${settings.model}`, href: "#" },
              ]
            : []
        }
        btn1={
          settings.create
            ? {
                name: `New  ${settings.model}`,
                fn: () => {
                  setValuesToEdit([]);
                  setOpenCreate(true);
                },
              }
            : undefined
        }
      />

      <section id="list" className="px-4 sm:px-6 lg:px-8">
        {loading ? (
          <SkeletonTable count={10} />
        ) : (
          <div className="  flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                {!data || data?.length === 0 ? (
                  <div className="flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center pt-7">
                      <ArrowPathIcon
                        className="h-10 w-10 text-primary"
                        aria-hidden="true"
                      />
                      <h3 className="text-lg leading-6 font-medium text-primary">
                        There are not {settings.model} created
                      </h3>
                      {settings.create && (
                        <>
                          <p className="mt-4 max-w-2xl text-sm text-primary">
                            Start creating a new
                            {settings.model}
                          </p>
                          <button
                            onClick={() => {
                              settings.create && setOpenCreate(true);
                            }}
                            type="button"
                            className="mt-4 btn-main"
                          >
                            Add {settings.model}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                          No
                        </th>
                        {settings.fields
                          .filter((f) => !f.list?.disabled)
                          .map((column: any, index: number) => (
                            <th
                              key={`column-${index}`}
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                            >
                              {column.label}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-main text-primary">
                      {data?.map((item: any) => (
                        <tr key={`contract-${item.id}`}>
                          <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                            <div className="flex items-center space-x-3">
                              <div className="bg-main w-8 h-8 text-base justify-center p-1 items-center rounded-lg">
                                # <span>{item.id as string}</span>
                              </div>
                            </div>
                          </td>

                          {settings.fields
                            .filter((f) => !f.list?.disabled)
                            .map((column: FieldType, index: number) => {
                              const columnKey = column.nameForList
                                ? column.nameForList
                                : column.name;

                              if (columnKey.includes(".")) {
                                const nestedValue = getNestedValue(
                                  item,
                                  columnKey
                                );

                                return (
                                  <td
                                    key={`column-${index}`}
                                    scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold   sm:pl-0"
                                  >
                                    {parseFinalValue(column, nestedValue)}
                                  </td>
                                );
                              } else {
                                return (
                                  <td
                                    key={`column-${index}`}
                                    scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold   sm:pl-0"
                                  >
                                    {columnKey === "status" ? (
                                      <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeClass(
                                          item[`${columnKey}`]
                                        )}`}
                                      >
                                        {getStatusName(item[`${columnKey}`])}
                                      </span>
                                    ) : (
                                      <div>
                                        <div>
                                          {parseFinalValue(
                                            column,
                                            item[`${column.name}`]
                                          )}{" "}
                                        </div>
                                      </div>
                                    )}
                                  </td>
                                );
                              }
                            })}

                          <td className=" px-3 flex space-x-2 py-5 text-sm text-gray-500">
                            {settings.edit && (
                              <button
                                onClick={() => {
                                  setValuesToEdit(item);
                                  setOpenCreate(true);
                                }}
                                className="btn-main"
                              >
                                <PencilIcon className="h-5 w-5 text-primary" />
                              </button>
                            )}
                            {!settings.view?.disabled && (
                              <button
                                onClick={() => {
                                  setValuesToView(item);
                                  setOpenView(true);
                                }}
                                className="btn-main"
                              >
                                <EyeIcon className="h-5 w-5 text-primary" />
                              </button>
                            )}
                            {settings.delete && (
                              <button
                                className="btn-main"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <TrashIcon className="h-5 w-5 text-primary" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <Transition.Root show={openCreate} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          initialFocus={cancelButtonRef}
          onClose={setOpenCreate}
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

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full  justify-center p-4 text-center sm:items-center sm:p-0">
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
                  className="relative text-left transform overflow-hidden rounded-lg
                    bg-main px-4 pb-4 pt-5  shadow-xl transition-all sm:my-8 h-full  
                    w-full  sm:w-3/5 sm:m-3 sm:p-6"
                >
                  <div className="flex justify-end">
                    <XMarkIcon
                      className="h-6 w-6 text-gray-500 cursor-pointer"
                      onClick={() => setOpenCreate(false)}
                    />
                  </div>
                  <div className="h-full">
                    <div className="mt-3 flex flex-col  sm:mt-5">
                      <div className="flex mt-2">
                        <NewForm
                          info={{
                            name: `Nuevo ${settings.model}`,
                            description: `Nuevo ${settings.model}`,
                          }}
                          fields={
                            settings.fields.filter(
                              (f) => f.type !== "customList"
                            ) as any[]
                          }
                          onSubmit={handleOnSubmitCreate}
                          values={valuesToEdit}
                        />
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <Transition.Root show={openView} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          initialFocus={cancelButtonRef}
          onClose={setOpenView}
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

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full  justify-center p-4 text-center sm:items-center sm:p-0">
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
                  className="relative text-left transform rounded-lg overflow-hidden
                    bg-main text-primary px-4 pb-4 pt-5  shadow-xl transition-all sm:my-8 h-full  
                    w-full  sm:w-2/5 sm:m-3 sm:p-6"
                >
                  <div className="flex justify-end">
                    <XMarkIcon
                      className="h-6 w-6  cursor-pointer"
                      onClick={() => setOpenView(false)}
                    />
                  </div>
                  <div className="h-full">
                    <div className="mt-3 flex flex-col  sm:mt-5">
                      <div className="flex w-full   ">
                        <div className="w-full  ">
                          {settings.fields.map((column, index) => {
                            const value = column.name.includes(".")
                              ? getNestedValue(valuesToView, column.name)
                              : valuesToView[column.name];

                            return (
                              <GridItem
                                key={`column-${index}`}
                                column={column}
                                value={value}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
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

const TextItem = ({ column, value }: { column: any; value: any }) => (
  <span>
    {" "}
    {column.name === "status" ? (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeClass(
          value
        )}`}
      >
        {getStatusName(value)}
      </span>
    ) : (
      <div>
        {column.columnFormater ? (
          <div>{column.columnFormater(value)}</div>
        ) : (
          <span>{value} </span>
        )}
      </div>
    )}
  </span>
);

const TextDate = ({ value }: { value: string }) => (
  <span> {formatTimestampToDateString(value)}</span>
);

const TextLink = ({ value }: { value: string }) => (
  <span>
    {" "}
    <a
      href={value.includes("http") ? value : `https://${value}`}
      target="_blank"
    >
      {value.slice(0, 20)}
    </a>
  </span>
);

const GridItem = ({ column, value }: { column: any; value: any }) => (
  <div className="grid w-full justify-evenly gap-8 place-items-start  grid-cols-1 lg:grid-cols-5 pt-3">
    <div className="col-span-1 lg:col-span-1 text-left">
      <dt className="text-sm  font-medium  ">{column.label}</dt>
    </div>
    <div className="col-span-1 lg:col-span-3 ">
      <dd className="  text-sm  ">
        {column.type === "text" && <TextItem column={column} value={value} />}
        {column.type === "select" && <TextItem column={column} value={value} />}
        {column.type === "number" && <TextItem column={column} value={value} />}
        {column.type === "date" && <TextDate value={value} />}
        {column.type === "link" && <TextLink value={value} />}
      </dd>
    </div>
  </div>
);
export default NewCRUD;
