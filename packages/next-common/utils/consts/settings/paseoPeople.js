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
      name: "IBP1",
      url: "wss://sys.ibp.network/people-paseo",
    },
    {
      name: "IBP2",
      url: "wss://people-paseo.dotters.network",
    },
  ],
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
};

export default paseoPeople;
