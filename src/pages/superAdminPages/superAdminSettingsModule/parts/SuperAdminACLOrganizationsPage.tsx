/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@apollo/client";

import { ModuleType } from "../superAdminSettingTypes";
import { GET_ALL_ORGANIZATIONS_WITH_PERMISSIONS } from "../../organizationModule/organizationGraphql";

const SuperAdminACLOrganizationsPage = () => {
  //Queries and Mutations
  const { data: organizationDB } = useQuery(GET_ALL_ORGANIZATIONS_WITH_PERMISSIONS);

  return (
    <>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 ">
        <div className="border-2 border-gray-200 border-dotted rounded-xl p-3">
          <div className="flex justify-between">
            <h2 className="text-subtitle">Organizations Security Rules</h2>
          </div>
          <hr className="my-7" />
          <div className="flex flex-col space-y-3 my-3 mx-1">
            {organizationDB?.getAllOrganizationsWithPermissions?.map(
              (organization: ModuleType) => (
                <div
                  key={organization.id}
                  className={`flex justify-between items-center cursor-pointer p-3 rounded-2xl ${"hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                >
                  <div className="flex flex-col">
                    <h3 className="text-subtitle font-bold">
                      {organization.name}
                    </h3>
                    <p className="text-gray-500">
                      {organization.Permission?.length} Permissions
                    </p>
                    <div className="flex items-center space-x-3 flex-wrap my-7">
                      {organization.Permission?.map((permission: any) => (
                        <button key={permission.id} className="badge-orange ">
                          {permission.name}
                        </button>
                      ))}
                    </div>
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
    </>
  );
};

export default SuperAdminACLOrganizationsPage;
