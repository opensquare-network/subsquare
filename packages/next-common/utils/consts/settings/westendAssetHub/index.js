import Chains from "next-common/utils/consts/chains";
import westendAssetHubNodes from "next-common/utils/consts/settings/westendAssetHub/endpoints";
import dynamic from "next/dynamic";
import polkadotLinks from "next-common/utils/consts/settings/polkadot/links";
import MenuGroups from "next-common/utils/consts/settings/menuGroups";
import { westendAssetHubThemeVars } from "next-common/utils/consts/settings/westendAssetHub/theme";
import westend from "../westend";

const ProjectIconWestendAssethub = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconWestendAssethub"),
);

const name = Chains.westendAssetHub;

const westendAssetHub = {
  value: name,
  name: "Asset Hub",
  identity: Chains.westend,
  symbol: "WND",
  decimals: 12,
  ss58Format: 42,
  blockTime: 12000,
  endpoints: westendAssetHubNodes,
  avatar: ProjectIconWestendAssethub,
  darkAvatar: ProjectIconWestendAssethub,
  navLogo: westend.navLogo,
  navLogoDark: westend.navLogoDark,
  networkIcon: ProjectIconWestendAssethub,
  group: MenuGroups.WestendAndParachains,
  links: polkadotLinks,
  noScan: true,
  integrations: {
    statescan: true,
    subscan: {
      domain: "assethub-westend",
    },
  },
  description:
    "System parachain on Westend network for creating and sending tokens and NFTs.",
  ...westendAssetHubThemeVars,
  multisigWallets: {
    signet: true,
  },
  modules: {
    proxy: {
      provider: "chain",
    },
  },
};

export default westendAssetHub;
