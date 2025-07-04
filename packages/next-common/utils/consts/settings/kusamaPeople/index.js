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
      name: "Parity",
      url: "wss://kusama-people-rpc.polkadot.io",
    },
    {
      name: "IBP1",
      url: "wss://sys.ibp.network/people-kusama",
    },
    {
      name: "OnFinality",
      url: "wss://people-kusama.api.onfinality.io/public-ws",
    },
    {
      name: "IBP2",
      url: "wss://people-kusama.dotters.network",
    },
    {
      name: "Dwellir",
      url: "wss://people-kusama-rpc.n.dwellir.com",
    },
    {
      name: "LuckyFriday",
      url: "wss://rpc-people-kusama.luckyfriday.io",
    },
    {
      name: "Stakeworld",
      url: "wss://ksm-rpc.stakeworld.io/people",
    },
    {
      name: "Helixstreet",
      url: "wss://rpc-people-kusama.helixstreet.io",
    },
  ],
  group: null,
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
  allowWeb2Login: true,
  supportWalletconnect: true,
};

export default kusamaPeople;
