import {
  ArrowRight,
  MenuCouncil,
  MenuAuthorities,
  MenuData,
  MenuRegistrars,
} from "@osn/icons/subsquare";
import { NAV_MENU_TYPE } from "next-common/utils/constants";

export const stakingMenu = {
  name: "Staking",
  value: "staking",
  pathname: "/staking",
  icon: <MenuCouncil />,
  extra: <ArrowRight className="text-navigationTextTertiary" />,
  type: NAV_MENU_TYPE.subspace,
  items: [
    {
      name: "Overview",
      value: "overview",
      pathname: "/staking",
      icon: <MenuAuthorities />,
    },
    {
      type: "divider",
    },
    {
      name: "Validators",
      value: "validators",
      pathname: "/staking/validators",
      icon: <MenuData />,
    },
    {
      name: "Pools",
      value: "pools",
      pathname: "/staking/pools",
      icon: <MenuRegistrars />,
    },
  ],
};
