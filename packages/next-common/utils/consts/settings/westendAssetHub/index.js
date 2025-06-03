import Chains from "next-common/utils/consts/chains";
import { westendAssetHubNodes } from "next-common/utils/consts/settings/westend/nodes";
import dynamic from "next/dynamic";
import polkadotLinks from "next-common/utils/consts/settings/polkadot/links";
import MenuGroups from "next-common/utils/consts/settings/menuGroups";
import westendCommonCfg, {
  westendAssethubMigration,
} from "next-common/utils/consts/settings/westend/common";

const ProjectIconWestendAssethub = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconWestendAssethub"),
);

const name = Chains.westendAssetHub;

const westendAssetHub = {
  value: name,
  name: "Asset Hub",
  ...westendCommonCfg,
  blockTime: 12000,
  assethubMigration: westendAssethubMigration,
  endpoints: westendAssetHubNodes,
  avatar: ProjectIconWestendAssethub,
  darkAvatar: ProjectIconWestendAssethub,
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
  multisigWallets: {
    signet: true,
  },
  modules: {
    proxy: {
      provider: "chain",
    },
  },
  supportWalletconnect: true,
  allowWeb2Login: true,
};

export default westendAssetHub;
