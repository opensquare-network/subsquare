import { MenuData } from "@osn/icons/subsquare";

const Data = {
  name: "Data",
  value: "data",
  pathname: "/proxies",
  icon: <MenuData />,
  extraMatchNavMenuActivePathnames: ["/proxies", "/vesting", "/multisigs"],
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
      name: "Multisigs",
      value: "multisig",
      pathname: "/multisigs",
    },
  ],
};

export default Data;
