import { MenuAsset } from "@osn/icons/subsquare";
import { overviewMenu } from "./common";

const assetsMenu = {
  value: "assets",
  name: "Assets",
  pathname: "/assets",
  icon: <MenuAsset />,
};

const assetHubMenu = [overviewMenu, { type: "divider" }, assetsMenu];

export { assetHubMenu };
