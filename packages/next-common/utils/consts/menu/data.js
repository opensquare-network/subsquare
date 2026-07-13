import { MenuData } from "@osn/icons/subsquare";

function getDataMenu() {
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
