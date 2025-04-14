import {
  ArrowRight,
  MenuCouncil,
  MenuAuthorities,
  MenuData,
} from "@osn/icons/subsquare";
import { NAV_MENU_TYPE } from "next-common/utils/constants";

export const peopleMenu = {
  name: "People",
  value: "people",
  pathname: "/people",
  icon: <MenuCouncil />,
  extra: <ArrowRight className="text-navigationTextTertiary" />,
  type: NAV_MENU_TYPE.subspace,
  items: [
    {
      name: "My Identity",
      value: "people",
      pathname: "/people",
      icon: <MenuAuthorities />,
    },
    {
      name: "Identities",
      value: "identities",
      pathname: "/people/identities",
      icon: <MenuData />,
    },
  ],
};
