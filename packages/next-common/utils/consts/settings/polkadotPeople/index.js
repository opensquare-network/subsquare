import dynamic from "next/dynamic";
import Chains from "../../chains";
import polkadot from "../polkadot";

const ProjectIconPolkadotPeople = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPolkadotPeople"),
);

const polkadotPeople = {
  ...polkadot,
  name: "People",
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
      name: "IBP1",
      url: "wss://sys.ibp.network/people-polkadot",
    },
    {
      name: "OnFinality",
      url: "wss://people-polkadot.api.onfinality.io/public-ws",
    },
    {
      name: "IBP2",
      url: "wss://people-polkadot.dotters.network",
    },
    {
      name: "LuckyFriday",
      url: "wss://rpc-people-polkadot.luckyfriday.io",
    },
    {
      name: "Dwellir",
      url: "wss://people-polkadot-rpc.n.dwellir.com",
    },
    {
      name: "Stakeworld",
      url: "wss://dot-rpc.stakeworld.io/people",
    },
  ],
  group: null,
  noScan: true,
  integrations: {
    statescan: true,
    subscan: {
      domain: "people-polkadot",
    },
  },
  multisigWallets: {
    mimir: true,
  },
  allowWeb2Login: true,
  supportWalletconnect: true,
  supportPolkadotVault: true,
};

export default polkadotPeople;
