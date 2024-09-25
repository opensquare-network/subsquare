import Chains from "next-common/utils/consts/chains";
import westendAssetHubNodes from "next-common/utils/consts/settings/westendAssetHub/endpoints";
import dynamic from "next/dynamic";
import polkadotLinks from "next-common/utils/consts/settings/polkadot/links";
import MenuGroups from "next-common/utils/consts/settings/menuGroups";
import { westendAssetHubThemeVars } from "next-common/utils/consts/settings/westendAssetHub/theme";

const ProjectLogoPolkadotAssetHub = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoPolkadotAssethub"),
);
const ProjectIconPolkadotAssetHub = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPolkadotAssethub"),
);

const NetworkIconPolkadotAssetHub = dynamic(() =>
  import("@osn/icons/subsquare/NetworkPolkadotAssethubLight"),
);

const name = Chains.westendAssetHub;

const westendAssetHub = {
  value: name,
  name: "Asset Hub",
  identity: Chains.polkadot,
  symbol: "DOT",
  decimals: 10,
  ss58Format: 0,
  blockTime: 12000,
  endpoints: westendAssetHubNodes,
  avatar: ProjectIconPolkadotAssetHub,
  darkAvatar: ProjectIconPolkadotAssetHub,
  navLogo: ProjectLogoPolkadotAssetHub,
  navLogoDark: ProjectLogoPolkadotAssetHub,
  networkIcon: NetworkIconPolkadotAssetHub,
  group: MenuGroups.WestendAndParachains,
  links: polkadotLinks,
  integrations: {
    statescan: true,
    subscan: {
      domain: "assethub-westend",
    },
  },
  description:
    "System parachain on Polkadot network for creating and sending tokens and NFTs.",
  ...westendAssetHubThemeVars,
  multisigWallets: {
    signet: true,
    mimir: true,
  },
};

export default westendAssetHub;
