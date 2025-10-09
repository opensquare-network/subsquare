import {
  ArrowRight,
  MenuAsset,
  MenuOverview,
  MenuForeignAsset,
} from "@osn/icons/subsquare";
import { NAV_MENU_TYPE } from "next-common/utils/constants";

export const assetsMenu = {
  name: "Assets",
  value: "assets",
  pathname: "/assets",
  icon: <MenuAsset />,
  extra: <ArrowRight className="text-navigationTextTertiary" />,
  type: NAV_MENU_TYPE.subspace,
  items: [
    {
      name: "Overview",
      value: "overview",
      pathname: "/assets",
      icon: <MenuOverview />,
    },
    {
      name: "Assets",
      value: "assets",
      pathname: "/assets/assets",
      icon: <MenuAsset />,
    },
    {
      name: "Foreign Assets",
      value: "foreignAssets",
      pathname: "/assets/foreign-assets",
      icon: <MenuForeignAsset />,
    },
  ],
};
