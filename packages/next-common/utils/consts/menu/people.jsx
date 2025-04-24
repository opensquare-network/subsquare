import {
  ArrowRight,
  MenuCouncil,
  MenuAuthorities,
  MenuData,
  MenuRegistrars,
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
      name: "Overview",
      value: "overview",
      pathname: "/people",
      icon: <MenuAuthorities />,
    },
    {
      name: "Identities",
      value: "identities",
      pathname: "/people/identities",
      icon: <MenuData />,
    },
    {
      type: "divider",
    },
    {
      name: "Registrars",
      value: "registrars",
      pathname: "/people/registrars",
      icon: <MenuRegistrars />,
    },
  ],
};
