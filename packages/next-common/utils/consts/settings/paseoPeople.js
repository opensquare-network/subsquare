import dynamic from "next/dynamic";
import Chains from "../chains";
import paseo from "./paseo";

const ProjectIconPolkadotPeople = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPaseoPeople"),
);

const paseoPeople = {
  ...paseo,
  name: "People",
  value: Chains.paseoPeople,
  description:
    "A comprehensive view of identity management and social interaction activities within the ecosystem.",
  avatar: ProjectIconPolkadotPeople,
  darkAvatar: ProjectIconPolkadotPeople,
  endpoints: [
    {
      name: "Amforc",
      url: "wss://people-paseo.rpc.amforc.com",
    },
    {
      name: "Zondax",
      url: "wss://api2.zondax.ch/pas/people/node/rpc",
    },
  ],
  modules: {
    ...paseo.modules,
    vesting: false,
  },
  group: null,
  noScan: true,
  integrations: {
    statescan: false,
    subscan: {
      domain: "people-paseo",
    },
  },
  multisigWallets: {
    mimir: true,
  },
  allowWeb2Login: true,
  hideHeight: false,
};

export default paseoPeople;
