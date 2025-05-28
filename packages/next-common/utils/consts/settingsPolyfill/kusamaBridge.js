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
      name: "IBP1",
      url: "wss://sys.ibp.network/bridgehub-kusama",
    },
    {
      name: "IBP2",
      url: "wss://bridge-hub-kusama.dotters.network/",
    },
  ],
};
