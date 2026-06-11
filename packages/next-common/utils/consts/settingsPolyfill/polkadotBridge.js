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
      name: "Parity",
      url: "wss://polkadot-bridge-hub-rpc.polkadot.io/",
    },
    {
      name: "Dwellir",
      url: "wss://bridge-hub-polkadot-rpc.n.dwellir.com",
    },
    {
      name: "LuckyFriday",
      url: "wss://rpc-bridge-hub-polkadot.luckyfriday.io",
    },
    {
      name: "OnFinality",
      url: "wss://bridgehub-polkadot.api.onfinality.io/public-ws",
    },
  ],
};
