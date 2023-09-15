import { useQuery } from "@apollo/client";
import SocialLinks from "../frontendComponents/SocialLinks";
import { GET_PLATFORM_GENERAL_DATA } from "../../utils/queries";
import { getSettingValue } from "../../utils/facades/resorceFacade";
import { Link } from "react-router-dom";

export default function Footer() {
  const { data: generalData } = useQuery(GET_PLATFORM_GENERAL_DATA);
  const general = generalData?.getPlatformGeneralData ?? [];
  const platformName: string = getSettingValue(general, "PLATFORM_NAME");
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex    justify-center space-x-6 md:order-2">
          <SocialLinks />
        </div>

        <div className="mt-8 md:order-1 md:mt-0 flex flex-col space-y-3">
          <p className="text-center text-sm leading-5 text-gray-500">
            &copy; {platformName}. All rights reserved.
          </p>
          <Link to={"/privacy"} className="text-sm">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
