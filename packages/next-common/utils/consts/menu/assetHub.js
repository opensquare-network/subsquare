import { ArrowRight, MenuAsset, MenuOverview } from "@osn/icons/subsquare";
import { NAV_MENU_TYPE } from "next-common/utils/constants";

export const assetsHubMenu = {
  name: "AssetsHub",
  value: "assetsHub",
  pathname: "/assetshub",
  icon: <MenuAsset />,
  extra: <ArrowRight className="text-navigationTextTertiary" />,
  type: NAV_MENU_TYPE.subspace,
  items: [
    {
      name: "Overview",
      value: "overview",
      pathname: "/assetshub",
      icon: <MenuOverview />,
    },
  ],
};
