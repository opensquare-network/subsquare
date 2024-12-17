import dynamic from "next/dynamic";
import Chains from "../../chains";
import polkadot from "../polkadot";

const ProjectIconPolkadotCoretime = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPolkadotCoretime"),
);

const polkadotCoretime = {
  ...polkadot,
  value: Chains.polkadotCoretime,
  description:
    "A revolutionary approach to accessing the right amount of blockspace for every stage of growth.",
  avatar: ProjectIconPolkadotCoretime,
  darkAvatar: ProjectIconPolkadotCoretime,
  endpoints: [
    {
      name: "Parity",
      url: "wss://polkadot-coretime-rpc.polkadot.io",
    },
    {
      name: "IBP2",
      url: "wss://coretime-polkadot.dotters.network",
    },
  ],
  integrations: {
    subscan: {
      domain: "coretime-polkadot",
    },
  },
  multisigWallets: {
    mimir: true,
  },
};

export default polkadotCoretime;
