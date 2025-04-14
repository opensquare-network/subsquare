import dynamic from "next/dynamic";
import Chains from "../../chains";
import polkadot from "../polkadot";

const ProjectIconPolkadotPeople = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPolkadotPeople"),
);

const polkadotPeople = {
  ...polkadot,
  value: Chains.polkadotPeople,
  description:
    "A comprehensive view of identity management and social interaction activities within the ecosystem.",
  avatar: ProjectIconPolkadotPeople,
  darkAvatar: ProjectIconPolkadotPeople,
  endpoints: [
    {
      name: "Parity",
      url: "wss://polkadot-people-rpc.polkadot.io",
    },
    {
      name: "IBP2",
      url: "wss://people-polkadot.dotters.network",
    },
  ],
  integrations: {
    subscan: {
      domain: "people-polkadot",
    },
  },
  multisigWallets: {
    mimir: true,
  },
};

export default polkadotPeople;
