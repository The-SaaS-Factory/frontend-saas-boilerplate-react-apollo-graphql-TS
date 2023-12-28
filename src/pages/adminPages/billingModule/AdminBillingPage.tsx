/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useOrganization, useUser } from "@clerk/clerk-react";
import PlansComponent from "../../superAdminPages/plansModule/PlansComponent";
import { useEffect, useState } from "react";
import AdminPlanActive from "./AdminPlanActive";
import { systemScope } from "@/utils/constants/globalContants";

export default function AdminBillingPage() {
  const [viewBuyPlan, setViewBuyPlan] = useState(true);
  const { organization } = useOrganization();
  const { user } = useUser();

  useEffect(() => {
    if (organization) {
      if (organization.publicMetadata?.membershipActive) {
        setViewBuyPlan(false);
      }
    }
    if (user) {
      if (user.publicMetadata?.membershipActive) {
        setViewBuyPlan(false);
      }
    }
  }, [organization, user]);

  return (
    <div>
      <div className="bg-white -mt-3 ">
        <div>
          {organization && organization.publicMetadata?.membershipActive ? (
            <MembershipActivateBanner
              membershipData={organization.publicMetadata}
              setViewBuyPlan={() => setViewBuyPlan(!viewBuyPlan)}
            />
          ) : null}
        </div>
        <div>
          {user &&
          systemScope === "personal" &&
          user.publicMetadata?.membershipActive ? (
            <MembershipActivateBanner
              membershipData={user.publicMetadata}
              setViewBuyPlan={() => setViewBuyPlan(!viewBuyPlan)}
            />
          ) : null}
        </div>
      </div>
      {viewBuyPlan ? (
        <>
          <PlansComponent />
        </>
      ) : (
        <div>
          <AdminPlanActive />
        </div>
      )}
    </div>
  );
}

const MembershipActivateBanner = ({
  membershipData,
  setViewBuyPlan,
}: {
  membershipData: any;
  setViewBuyPlan: () => void;
}) => {
  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <div
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
        />
      </div>
      <div
        className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
        />
      </div>
      <div className="flex items-center space-x-2">
        <p className="title">
          <span>
            Congratulations, you have a
            <strong className="font-semibold pr-1">
              {" "}
              {membershipData.membershipPlan}
            </strong>
            plan
            <svg
              viewBox="0 0 2 2"
              className="mx-2 inline h-0.5 w-0.5 fill-current"
              aria-hidden="true"
            >
              <circle cx={1} cy={1} r={1} />
            </svg>
            active until{" "}
            {new Date(membershipData.membershipEndDate).toDateString()}
          </span>
        </p>
        <button className="btn-main" onClick={() => setViewBuyPlan()}>
          Change Plan
        </button>
      </div>
      <div className="flex flex-1 justify-end"></div>
    </div>
  );
};
