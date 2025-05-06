import dynamic from "next/dynamic";
import Chains from "../../chains";
import kusama from "../kusama";

const ProjectIconkusamaPeople = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconKusamaPeople"),
);

const kusamaPeople = {
  ...kusama,
  name: "People",
  value: Chains.kusamaPeople,
  description:
    "A comprehensive view of identity management and social interaction activities within the ecosystem.",
  avatar: ProjectIconkusamaPeople,
  darkAvatar: ProjectIconkusamaPeople,
  endpoints: [
    {
      name: "Dwellir",
      url: "wss://people-kusama-rpc.n.dwellir.com",
    },
    {
      name: "IBP1",
      url: "wss://sys.ibp.network/people-kusama",
    },
    {
      name: "IBP2",
      url: "wss://people-kusama.dotters.network",
    },
    {
      name: "LuckyFriday",
      url: "wss://rpc-people-kusama.luckyfriday.io",
    },
    {
      name: "Parity",
      url: "wss://kusama-people-rpc.polkadot.io",
    },
    {
      name: "Stakeworld",
      url: "wss://ksm-rpc.stakeworld.io/people",
    },
  ],
  noScan: true,
  integrations: {
    statescan: true,
    subscan: {
      domain: "people-kusama",
    },
  },
  multisigWallets: {
    mimir: true,
  },
};

export default kusamaPeople;
