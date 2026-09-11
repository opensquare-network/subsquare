import {
  ArrowRight,
  MenuCoretime,
  MenuOverview,
  MenuHistory,
  MenuTracks,
  MenuAdvanced,
} from "@osn/icons/subsquare";
import { NAV_MENU_TYPE } from "next-common/utils/constants";

export const coretimeMenu = {
  name: "Coretime",
  value: "coretime",
  pathname: "/coretime",
  icon: <MenuCoretime />,
  extra: <ArrowRight className="text-navigationTextTertiary" />,
  type: NAV_MENU_TYPE.subspace,
  items: [
    {
      name: "Overview",
      value: "overview",
      pathname: "/coretime",
      icon: <MenuOverview />,
    },
    {
      name: "Sales",
      value: "sales",
      pathname: "/coretime/sales",
      icon: <MenuHistory />,
      extraMatchNavMenuActivePathnames: ["/coretime/sales/[id]"],
    },
    {
      name: "Cores",
      value: "cores",
      pathname: "/coretime/cores",
      icon: <MenuTracks />,
    },
    {
      name: "Regions",
      value: "regions",
      pathname: "/coretime/regions",
      icon: <MenuAdvanced />,
    },
  ],
};
