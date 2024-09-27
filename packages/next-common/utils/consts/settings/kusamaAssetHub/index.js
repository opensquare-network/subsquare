import Chains from "next-common/utils/consts/chains";
import kusamaAssetHubNodes from "next-common/utils/consts/settings/kusamaAssetHub/endpoints";
import dynamic from "next/dynamic";
import kusamaLinks from "next-common/utils/consts/settings/kusama/links";
import MenuGroups from "next-common/utils/consts/settings/menuGroups";
import { kusamaAssetHubThemeVars } from "next-common/utils/consts/settings/kusamaAssetHub/theme";

const ProjectIconKusamaAssethub = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconKusamaAssethub"),
);

const ProjectLogoKusamaAssethub = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoKusamaAssethub"),
);

const name = Chains.kusamaAssetHub;

const kusamaAssetHub = {
  value: name,
  name: "Asset Hub",
  identity: Chains.kusama,
  symbol: "KSM",
  decimals: 12,
  ss58Format: 2,
  blockTime: 12000,
  endpoints: kusamaAssetHubNodes,
  avatar: ProjectIconKusamaAssethub,
  darkAvatar: ProjectIconKusamaAssethub,
  navLogo: ProjectLogoKusamaAssethub,
  navLogoDark: ProjectLogoKusamaAssethub,
  networkIcon: ProjectIconKusamaAssethub,
  group: MenuGroups.KusamaAndParachains,
  links: kusamaLinks,
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
};

export default kusamaAssetHub;