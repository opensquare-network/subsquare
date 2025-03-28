import Chains from "next-common/utils/consts/chains";
import westendAssetHubNextNodes from "./endpoints";
import dynamic from "next/dynamic";
import polkadotLinks from "next-common/utils/consts/settings/polkadot/links";
import MenuGroups from "next-common/utils/consts/settings/menuGroups";
import { westendAssetHubThemeVars } from "next-common/utils/consts/settings/westendAssetHub/theme";
import westend from "../westend";
import { mergeChainModules } from "../common/modules";

const ProjectIconWestendAssethub = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconWestendAssethub"),
);

const name = Chains.westendAssetHubNext;

const westendAssetHubNext = {
  value: name,
  name: "Asset Hub Next",
  identity: Chains.westend,
  symbol: "WND",
  decimals: 12,
  ss58Format: 42,
  blockTime: 12000,
  endpoints: westendAssetHubNextNodes,
  avatar: ProjectIconWestendAssethub,
  darkAvatar: ProjectIconWestendAssethub,
  navLogo: westend.navLogo,
  navLogoDark: westend.navLogoDark,
  networkIcon: ProjectIconWestendAssethub,
  group: MenuGroups.WestendAndParachains,
  links: polkadotLinks,
  noScan: true,
  integrations: {
    statescan: { domain: "assethub-next-westend" },
  },
  description: "Asset Hub Next for Westend",
  ...westendAssetHubThemeVars,
  multisigWallets: {
    signet: true,
  },
  modules: mergeChainModules({
    referenda: true,
    treasury: {
      spends: true,
      proposals: true,
      bounties: false,
      tips: false,
    },
    democracy: false,
    council: false,
    technicalCommittee: false,
    vesting: true,
    proxy: {
      provider: "chain",
    },
  }),
};

export default westendAssetHubNext;
