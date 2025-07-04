import Chains from "next-common/utils/consts/chains";
import polkadotAssetHubNodes from "next-common/utils/consts/settings/polkadotAssetHub/endpoints";
import dynamic from "next/dynamic";
import polkadotLinks from "next-common/utils/consts/settings/polkadot/links";
import MenuGroups from "next-common/utils/consts/settings/menuGroups";
import { polkadotAssetHubThemeVars } from "next-common/utils/consts/settings/polkadotAssetHub/theme";
import polkadotCommonCfg from "next-common/utils/consts/settings/polkadot/common";

const ProjectIconPolkadotAssetHub = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPolkadotAssethub"),
);

const NetworkIconPolkadotAssetHub = dynamic(() =>
  import("@osn/icons/subsquare/NetworkPolkadotAssethubLight"),
);

const name = Chains.polkadotAssetHub;

const polkadotAssetHub = {
  value: name,
  name: "Asset Hub",
  ...polkadotCommonCfg,
  blockTime: 12000,
  endpoints: polkadotAssetHubNodes,
  avatar: ProjectIconPolkadotAssetHub,
  darkAvatar: ProjectIconPolkadotAssetHub,
  networkIcon: NetworkIconPolkadotAssetHub,
  group: MenuGroups.PolkadotAndParachains,
  links: polkadotLinks,
  noScan: true,
  integrations: {
    statescan: true,
    subscan: {
      domain: "assethub-polkadot",
    },
  },
  description:
    "System parachain on Polkadot network for creating and sending tokens and NFTs.",
  ...polkadotAssetHubThemeVars,
  multisigWallets: {
    signet: true,
    mimir: true,
  },
  modules: {
    proxy: {
      provider: "chain",
    },
  },
  allowWeb2Login: true,
  supportWalletconnect: true,
};

export default polkadotAssetHub;
