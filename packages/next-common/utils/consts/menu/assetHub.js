import { ArrowRight, MenuAsset, MenuOverview } from "@osn/icons/subsquare";
import { NAV_MENU_TYPE } from "next-common/utils/constants";

export const assetHubMenu = {
  name: "Asset Hub",
  value: "assetHub",
  pathname: "/assethub",
  icon: <MenuAsset />,
  extra: <ArrowRight className="text-navigationTextTertiary" />,
  type: NAV_MENU_TYPE.subspace,
  items: [
    {
      name: "Overview",
      value: "overview",
      pathname: "/assethub",
      icon: <MenuOverview />,
    },
    {
      name: "Assets",
      value: "assets",
      pathname: "/assethub/assets",
      icon: <MenuAsset />,
    },
  ],
};
