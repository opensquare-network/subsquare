import Chains from "next-common/utils/consts/chains";
import kusamaAssetHubNodes from "next-common/utils/consts/settings/kusamaAssetHub/endpoints";
import dynamic from "next/dynamic";
import kusamaLinks from "next-common/utils/consts/settings/kusama/links";
import MenuGroups from "next-common/utils/consts/settings/menuGroups";
import { kusamaAssetHubThemeVars } from "next-common/utils/consts/settings/kusamaAssetHub/theme";
import kusamaCommonCfg from "next-common/utils/consts/settings/kusama/common";

const ProjectIconKusamaAssethub = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconKusamaAssethub"),
);

const name = Chains.kusamaAssetHub;

const kusamaAssetHub = {
  value: name,
  name: "Asset Hub",
  ...kusamaCommonCfg,
  blockTime: 12000,
  endpoints: kusamaAssetHubNodes,
  avatar: ProjectIconKusamaAssethub,
  darkAvatar: ProjectIconKusamaAssethub,
  networkIcon: ProjectIconKusamaAssethub,
  group: MenuGroups.KusamaAndParachains,
  links: kusamaLinks,
  noScan: true,
  integrations: {
    statescan: true,
    subscan: {
      domain: "assethub-kusama",
    },
  },
  description:
    "System parachain on Kusama network for creating and sending tokens and NFTs.",
  ...kusamaAssetHubThemeVars,
  multisigWallets: {
    signet: true,
    mimir: true,
  },
  modules: {
    proxy: {
      provider: "chain",
    },
  },
};

export default kusamaAssetHub;
