import dynamic from "next/dynamic";

const ProjectIconPolkadotBridge = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPolkadotBridge"),
);

export default {
  name: "Bridge",
  avatar: ProjectIconPolkadotBridge,
  darkAvatar: ProjectIconPolkadotBridge,
  endpoints: [
    {
      name: "IBP1",
      url: "wss://sys.ibp.network/bridgehub-polkadot",
    },
    {
      name: "IBP2",
      url: "wss://bridge-hub-polkadot.dotters.network/",
    },
    {
      name: "Parity",
      url: "wss://polkadot-bridge-hub-rpc.polkadot.io/",
    },
  ],
};
