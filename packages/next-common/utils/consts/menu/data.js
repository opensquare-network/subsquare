import { MenuData } from "@osn/icons/subsquare";
import getChainSettings from "../settings";
import { CHAIN } from "next-common/utils/constants";

function getDataMenu() {
  const { modules } = getChainSettings(CHAIN);

  const children = [
    {
      name: "Proxies",
      value: "proxies",
      pathname: "/proxies",
    },
    {
      name: "Multisigs",
      value: "multisig",
      pathname: "/multisigs",
    },
  ];

  if (modules?.recovery) {
    children.push({
      name: "Recovery",
      value: "recovery",
      pathname: "/recovery",
    });
  }

  return {
    name: "Data",
    value: "data",
    pathname: "/proxies",
    icon: <MenuData />,
    extraMatchNavMenuActivePathnames: children.map((c) => c.pathname),
    children,
  };
}

export default getDataMenu;
