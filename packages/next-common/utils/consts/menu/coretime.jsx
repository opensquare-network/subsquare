import { ArrowRight, MenuCoretime, MenuOverview } from "@osn/icons/subsquare";
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
  ],
};
