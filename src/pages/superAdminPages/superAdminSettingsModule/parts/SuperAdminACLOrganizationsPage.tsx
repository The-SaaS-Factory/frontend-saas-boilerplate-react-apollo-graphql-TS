/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@apollo/client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ModuleType } from "../superAdminSettingTypes";
import { GET_ALL_ORGANIZATIONS_WITH_PERMISSIONS } from "../../organizationModule/organizationGraphql";
import PlusCircleIcon from "@heroicons/react/24/outline/PlusCircleIcon";
import XMarkIcon from "@heroicons/react/24/outline/esm/XMarkIcon";
import { SearchSelect, SearchSelectItem } from "@tremor/react";
import {
  ADD_PERMISSION_TO_ORGANIZATION,
  GET_PERMISSIONS,
  REMOVE_PERMISSION_FROM_ORGANIZATION,
} from "../superAdminSettingGraphql";
import { handleRequestError } from "@/utils/facades/handleRequestError";
import { toast } from "sonner";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const SuperAdminACLOrganizationsPage = () => {
  const [newPermissionModal, setNewPermissionModal] = useState(false);
  const [organizationSelected, setOrganizationSelected] =
    useState<ModuleType | null>(null);
  const [newPermissionsSelected, setNewPermissionsSelected] =
    useState<any>(null);
  //Queries and Mutations
  const { data: organizationDB, refetch } = useQuery(
    GET_ALL_ORGANIZATIONS_WITH_PERMISSIONS
  );
  const { data: permissions } = useQuery(GET_PERMISSIONS);
  const [addPermissionToOrganization] = useMutation(
    ADD_PERMISSION_TO_ORGANIZATION
  );
  const [removePermissionToOrganization] = useMutation(
    REMOVE_PERMISSION_FROM_ORGANIZATION
  );

  //Functions
  const handleAddPermissionToOrganizationModal = (organization: any) => {
    setOrganizationSelected(organization);
    setNewPermissionModal(true);
  };

  const handleAddNewPermissionToOrganization = () => {
    setNewPermissionModal(false);
    const payload = {
      organizationId: parseInt(organizationSelected?.id as string),
      permissionId: parseInt(newPermissionsSelected),
    };
    addPermissionToOrganization({
      variables: payload,
    })
      .then(() => {
        setNewPermissionsSelected(null);
        toast.success("Permission added to organization");
      })
      .catch((error) => {
        handleRequestError(error);
      });
  };

  const handleRemovePermissionFromOrganization = (
    permissionId: string,
    organizationId: string
  ) => {
    toast(
      "Are you sure you want to delete  this permission from this organization?",
      {
        action: {
          label: "Delete",
          onClick: () =>
            removePermissionToOrganization({
              variables: {
                permissionId: parseInt(permissionId),
                organizationId: parseInt(organizationId),
              },
            })
              .then(({ data }) => {
                setOrganizationSelected(data.removeOrganizationFromModule);
                toast.success("Permissions deleted successfully");
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

  const handleReloadData = () => {
    refetch();
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 ">
        <div className="border-2 border-gray-200 border-dotted rounded-xl p-3">
          <div className="flex justify-between">
            <h2 className="text-subtitle">Organizations Security Rules</h2>
            <div>
              <button className="btn-icon" onClick={() => handleReloadData()}>
                <ArrowPathIcon className="h-5 w-5 text-primary" />
                Reload
              </button>
            </div>
          </div>
          <hr className="my-7" />
          <div className="flex flex-col space-y-3 my-3  mx-1">
            {organizationDB?.getAllOrganizationsWithPermissions?.map(
              (organization: ModuleType) => (
                <div
                  key={organization.id}
                  className={`flex justify-between items-center cursor-pointer p-3 rounded-2xl ${"hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                >
                  <div className="flex flex-grow max-w-lg flex-col">
                    <h3 className="text-subtitle font-bold">
                      {organization.name}
                    </h3>
                    <p className="text-gray-500">
                      {organization.Permission?.length} Permissions
                    </p>
                    <div className="flex items-center gap-2   flex-wrap   my-7">
                      {organization.Permission?.map((permission: any) => (
                        <button
                          onClick={() =>
                            handleRemovePermissionFromOrganization(
                              permission.id,
                              organization.id
                            )
                          }
                          key={permission.id}
                          className="badge-orange "
                        >
                          {permission.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-grow-0 items-center h-14">
                    <button
                      className="btn-icon   items-center"
                      onClick={() =>
                        handleAddPermissionToOrganizationModal(organization)
                      }
                    >
                      <PlusCircleIcon className="h-5 w-5 text-gray-500" />{" "}
                      <span>Add permission</span>
                    </button>
                  </div>
                </div>
              )
            )}

            {organizationDB?.getAllOrganizationsWithPermissions?.length ===
              0 && (
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-subtitle  ">
                  No Organizations found with permissions
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>

      <Transition.Root show={newPermissionModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={setNewPermissionModal}
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
                            Add new permission to module{" "}
                            {organizationSelected?.name}
                          </Dialog.Title>
                          <div className=" flex items-center">
                            <button
                              type="button"
                              className="btn-main flex items-center"
                              onClick={() => setNewPermissionModal(false)}
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
                              onClick={() =>
                                handleAddNewPermissionToOrganization()
                              }
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

export default SuperAdminACLOrganizationsPage;
