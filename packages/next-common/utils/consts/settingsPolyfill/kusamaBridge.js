import dynamic from "next/dynamic";

const ProjectIconKusamaBridge = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconKusamaBridge"),
);

export default {
  name: "Bridge",
  avatar: ProjectIconKusamaBridge,
  darkAvatar: ProjectIconKusamaBridge,
  endpoints: [
    {
      name: "Parity",
      url: "wss://kusama-bridge-hub-rpc.polkadot.io/",
    },
    {
      name: "Dwellir",
      url: "wss://bridge-hub-kusama-rpc.n.dwellir.com",
    },
    {
      name: "LuckyFriday",
      url: "wss://rpc-bridge-hub-kusama.luckyfriday.io",
    },
    {
      name: "OnFinality",
      url: "wss://bridgehub-kusama.api.onfinality.io/public-ws",
    },
  ],
};
