import { MenuData } from "@osn/icons/subsquare";

const Data = {
  name: "Data",
  value: "data",
  pathname: "/proxies",
  icon: <MenuData />,
  extraMatchNavMenuActivePathnames: ["/proxies", "/vesting", "/multisig"],
  children: [
    {
      name: "Proxies",
      value: "proxies",
      pathname: "/proxies",
    },
    {
      name: "Vesting",
      value: "vesting",
      pathname: "/vesting",
    },
    {
      name: "Multisig",
      value: "multisig",
      pathname: "/multisig",
    },
  ],
};

export default Data;
