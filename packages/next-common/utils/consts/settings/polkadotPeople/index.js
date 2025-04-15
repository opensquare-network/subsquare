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
      name: "IBP1",
      url: "wss://sys.ibp.network/people-polkadot",
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
      name: "Parity",
      url: "wss://polkadot-people-rpc.polkadot.io",
    },
    {
      name: "RadiumBlock",
      url: "wss://people-polkadot.public.curie.radiumblock.co/ws",
    },
  ],
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
};

export default polkadotPeople;
