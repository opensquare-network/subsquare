import { MenuAsset } from "@osn/icons/subsquare";
import { NAV_MENU_TYPE } from "next-common/utils/constants";

export const assetsMenu = {
  name: "Assets",
  value: "assets",
  pathname: "/assets",
  icon: <MenuAsset />,
  type: NAV_MENU_TYPE.main,
};
