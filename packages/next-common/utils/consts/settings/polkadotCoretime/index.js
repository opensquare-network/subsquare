import dynamic from "next/dynamic";
import Chains from "../../chains";
import polkadotCommonCfg from "next-common/utils/consts/settings/polkadot/common";

const ProjectIconPolkadotCoretime = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPolkadotCoretime"),
);

const polkadotCoretime = {
  ...polkadotCommonCfg,
  value: Chains.polkadotCoretime,
  name: "Coretime",
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
      name: "LuckyFriday",
      url: "wss://rpc-coretime-polkadot.luckyfriday.io",
    },
    {
      name: "OnFinality",
      url: "wss://coretime-polkadot.api.onfinality.io/public-ws",
    },
    {
      name: "Dwellir",
      url: "wss://coretime-polkadot-rpc.n.dwellir.com",
    },
  ],
  integrations: {
    subscan: {
      domain: "coretime-polkadot",
    },
    statescan: true,
  },
  multisigWallets: {
    mimir: true,
  },
  allowWeb2Login: true,
  supportWalletconnect: true,
  supportPolkadotVault: true,
};

export default polkadotCoretime;
