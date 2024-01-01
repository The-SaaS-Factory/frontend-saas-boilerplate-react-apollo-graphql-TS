/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@apollo/client";
import ChevronRightIcon from "@heroicons/react/24/outline/ChevronRightIcon";
import {
  ADD_ORGANIZATION_TO_MODULE,
  ADD_PERMISSION_TO_MODULE,
  GET_MODULES,
  GET_PERMISSIONS,
  REMOVE_ORGANIZATION_FROM_MODULE,
  REMOVE_PERMISSION_FROM_MODULE,
} from "../superAdminSettingGraphql";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ModuleType } from "../superAdminSettingTypes";
import { SearchSelect, SearchSelectItem } from "@tremor/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { handleRequestError } from "@/utils/facades/handleRequestError";
import { GET_ALL_ORGANIZATIONS, GET_ALL_ORGANIZATIONS_WITH_PERMISSIONS } from "../../organizationModule/organizationGraphql";

const SuperAdminACLModulesPage = () => {
  //States
  const [moduleSelected, setModuleSelected] = useState<ModuleType | null>(null);
  const [scopeSelected, setScopeSelected] = useState<string>("ADMIN");
  const [openNewPermissionModal, setOpenNewPermissionModal] = useState(false);
  const [openNewOrganizationModal, setOpenNewOrganizationModal] =
    useState(false);
  const [newPermissionsSelected, setNewPermissionsSelected] =
    useState<ModuleType | null>(null);
  const [newOrganizationSelected, setNewOrganizationSelected] = useState<
    string | null
  >(null);

  //Queries and Mutations
  const { data, refetch } = useQuery(GET_MODULES);
  const { data: permissions } = useQuery(GET_PERMISSIONS);
  const [addPermissionToModule] = useMutation(ADD_PERMISSION_TO_MODULE);
  const { data: organizationDB } = useQuery(GET_ALL_ORGANIZATIONS);
  const [removePermissionFromModule] = useMutation(
    REMOVE_PERMISSION_FROM_MODULE
  );
  const [addOrganizationToModule] = useMutation(ADD_ORGANIZATION_TO_MODULE);
  const [removeOrganizationFromModule] = useMutation(
    REMOVE_ORGANIZATION_FROM_MODULE
  );

  //Functions
  const handleAddNewPermissionToModuleModal = (module: ModuleType) => {
    setOpenNewPermissionModal(true);
    setModuleSelected(module);
  };
  const handleAddNewOrganizationToModuleModal = () => {
    setOpenNewOrganizationModal(true);
  };

  const handleAddNewPermissionToModule = () => {
    const payload = {
      moduleId: moduleSelected?.id,
      permissionId: newPermissionsSelected,
    };
    addPermissionToModule({
      variables: payload,
      refetchQueries: [
        {
          query: GET_MODULES,
        },
      ],
    })
      .then(() => {
        setOpenNewPermissionModal(false);
        setNewPermissionsSelected(null);
        toast.success("Permission added to module");
      })
      .catch((error) => {
        handleRequestError(error);
      });
  };

  const handleAddNewOrganizationtoModule = () => {
    const payload = {
      moduleId: parseInt(moduleSelected?.id as string),
      organizationId: parseInt(newOrganizationSelected as string),
    };
    addOrganizationToModule({
      variables: payload,
      refetchQueries: [
        {
          query: GET_MODULES
        },
        {
          query: GET_ALL_ORGANIZATIONS_WITH_PERMISSIONS
        },
      ],
    })
      .then(({ data: response }) => {
        setModuleSelected(response.addOrganizationToModule);
        toast.success("Organization added to module");
        refetch();
      })
      .catch((error) => {
        handleRequestError(error);
      });
  };

  const handleRemovePermissionFromModule = (
    moduleId: string,
    permissionId: string
  ) => {
    toast("Are you sure you want to delete this permission from this module?", {
      action: {
        label: "Delete",
        onClick: () =>
          removePermissionFromModule({
            variables: {
              moduleId: parseInt(moduleId),
              permissionId: parseInt(permissionId),
            },
            refetchQueries: [
              {
                query: GET_MODULES
              },
              {
                query: GET_ALL_ORGANIZATIONS_WITH_PERMISSIONS
              },
            ],
          })
            .then(() => {
              toast.success("Permission deleted successfully");
            })
            .catch((e) => toast.error(e.message)),
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  const handleRemoveOrganizationFromModule = (
    moduleId: string,
    organizationId: string
  ) => {
    toast(
      "Are you sure you want to delete this organization from this module?",
      {
        action: {
          label: "Delete",
          onClick: () =>
            removeOrganizationFromModule({
              variables: {
                moduleId: parseInt(moduleId),
                organizationId: parseInt(organizationId),
              },
              refetchQueries: [
                {
                  query: GET_MODULES
                },
                {
                  query: GET_ALL_ORGANIZATIONS_WITH_PERMISSIONS
                },
              ],
            })
              .then(({ data }) => {
                setModuleSelected(data.removeOrganizationFromModule);
                toast.success("Organization deleted successfully");
              })
              .catch((e) => toast.error(e.message)),
        },
        cancel: {
          label: "Cancel",
          onClick: () => {},
        },
      }
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 ">
        <div className="border-2 border-gray-200 border-dotted rounded-xl p-3">
          <div className="flex justify-between">
            <h2 className="text-subtitle">Module Security Rules</h2>
            <div className="flex space-x-3">
              <button
                className={`btn-main ${
                  scopeSelected === "ADMIN" && "btn-main-selected"
                }`}
                onClick={() => setScopeSelected("ADMIN")}
              >
                Admin
              </button>
              <button
                className={`btn-main ${
                  scopeSelected === "SUPERADMIN" && "btn-main-selected"
                }`}
                onClick={() => setScopeSelected("SUPERADMIN")}
              >
                SuperAdmin
              </button>
            </div>
          </div>
          <hr className="my-7" />
          <div className="flex flex-col space-y-3 my-3 mx-1">
            {data?.getModules
              ?.filter((module: ModuleType) => module.scope === scopeSelected)
              .map((module: ModuleType) => (
                <div
                  key={module.id}
                  className={`flex justify-between items-center cursor-pointer p-3 rounded-2xl ${
                    moduleSelected?.id === module.id
                      ? "bg-main--selected  "
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex flex-col">
                    <h3 className="text-subtitle font-bold">{module.name}</h3>
                    <p className="text-gray-500">
                      {module.Permission?.length} Permissions
                    </p>
                    <div className="flex items-center gap-2   flex-wrap   my-7">
                      {module.Permission?.map((permission: any) => (
                        <button
                          onClick={() =>
                            handleRemovePermissionFromModule(
                              module.id,
                              permission.id
                            )
                          }
                          key={permission.id}
                          className="badge-orange "
                        >
                          {permission.name}
                        </button>
                      ))}
                    </div>
                    <div className="flex">
                      <button
                        className="btn-icon"
                        onClick={() =>
                          handleAddNewPermissionToModuleModal(module)
                        }
                      >
                        <PlusCircleIcon className="h-5 w-5 text-gray-500" />
                        <span>Add permission to {module.name} module</span>
                      </button>
                    </div>
                  </div>
                  <button
                    className="flex btn-icon items-center"
                    onClick={() => setModuleSelected(module)}
                  >
                    <span className="text-gray-500">Edit</span>
                    <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              ))}
          </div>
        </div>
        {moduleSelected && (
          <div className="border-2 border-gray-200 border-dotted rounded-xl p-3  overflow-y-auto">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <h2 className="text-subtitle space-x-1">
                  {" "}
                  <b> {moduleSelected?.name}</b>
                  <span>module overview</span>
                </h2>
              </div>
              <hr className="my-7" />
              <div>
                {!moduleSelected ? (
                  <div className="text-gray-500 rounded-2xl py-32 text-center bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-900">
                    Select a module
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <h3 className="text-tile font-medium text-primary">
                      Access to this module for the organizations
                    </h3>

                    <div className="flex flex-wrap items-center space-x-3 my-7">
                      {moduleSelected?.Organization?.map(
                        (organization: any) => (
                          <button
                            onClick={() =>
                              handleRemoveOrganizationFromModule(
                                moduleSelected.id,
                                organization.id
                              )
                            }
                            key={organization.id}
                            className="badge-red "
                          >
                            {organization.name}
                          </button>
                        )
                      )}
                    </div>
                    <div className="flex">
                      <button
                        className="btn-icon"
                        onClick={() => handleAddNewOrganizationToModuleModal()}
                      >
                        <PlusCircleIcon className="h-5 w-5 text-gray-500" />{" "}
                        <span>Add organization to this module</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Transition.Root show={openNewPermissionModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={setOpenNewPermissionModal}
        >
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-main text-primary py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6  ">
                            Add new permission to module {moduleSelected?.name}
                          </Dialog.Title>
                          <div className=" flex items-center">
                            <button
                              type="button"
                              className="btn-main flex items-center"
                              onClick={() => setOpenNewPermissionModal(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6 text-center"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6 ">
                        <div className=" flex flex-col justify-between h-full mt-auto">
                          <SearchSelect
                            className="w-full z-50"
                            placeholder="Select a permission"
                            onValueChange={(value: any) =>
                              setNewPermissionsSelected(value)
                            }
                          >
                            {permissions?.getPermissions.map(
                              (permission: any) => (
                                <SearchSelectItem
                                  key={permission.id}
                                  value={permission.id}
                                >
                                  {permission.name}
                                </SearchSelectItem>
                              )
                            )}
                          </SearchSelect>
                          <div className="flex justify-end">
                            <button
                              className="btn-main mt-3"
                              onClick={() => handleAddNewPermissionToModule()}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={openNewOrganizationModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={setOpenNewOrganizationModal}
        >
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-main text-primary py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6  ">
                            Add new organization to module{" "}
                            {moduleSelected?.name}
                          </Dialog.Title>
                          <div className=" flex items-center">
                            <button
                              type="button"
                              className="btn-main flex items-center"
                              onClick={() => setOpenNewOrganizationModal(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6 text-center"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6 ">
                        <div className=" flex flex-col justify-between h-full mt-auto">
                          <SearchSelect
                            className="w-full z-50"
                            placeholder="Select a organization"
                            onValueChange={(value: any) =>
                              setNewOrganizationSelected(value)
                            }
                          >
                            {organizationDB?.getAllOrganizations.map(
                              (organization: any) => (
                                <SearchSelectItem
                                  key={organization.id}
                                  value={organization.id}
                                >
                                  {organization.name}
                                </SearchSelectItem>
                              )
                            )}
                          </SearchSelect>
                          <div className="flex justify-end">
                            <button
                              className="btn-main mt-3"
                              onClick={() => handleAddNewOrganizationtoModule()}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default SuperAdminACLModulesPage;
