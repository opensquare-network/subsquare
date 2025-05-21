import dynamic from "next/dynamic";
import Chains from "../../chains";
import westendCommonCfg from "next-common/utils/consts/settings/westend/common";

const ProjectIconWestendPeople = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconWestendPeople"),
);

const westendPeople = {
  value: Chains.westendPeople,
  name: "People",
  ...westendCommonCfg,
  description:
    "A comprehensive view of identity management and social interaction activities within the ecosystem.",
  avatar: ProjectIconWestendPeople,
  darkAvatar: ProjectIconWestendPeople,
  endpoints: [
    {
      name: "Parity",
      url: "wss://westend-people-rpc.polkadot.io",
    },
    {
      name: "IBP1",
      url: "wss://sys.ibp.network/people-westend",
    },
    {
      name: "Dwellir",
      url: "wss://people-westend-rpc.n.dwellir.com",
    },
    {
      name: "IBP2",
      url: "wss://people-westend.dotters.network",
    },
  ],
  group: null,
  noScan: true,
  integrations: {
    statescan: false,
    subscan: {
      domain: "people-westend",
    },
  },
  multisigWallets: {
    mimir: true,
  },
  allowWeb2Login: true,
};

export default westendPeople;
