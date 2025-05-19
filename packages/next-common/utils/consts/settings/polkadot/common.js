import dynamic from "next/dynamic";
import Chains from "next-common/utils/consts/chains";
import { polkadotThemeVars } from "next-common/utils/consts/settings/common/polkadot";
const ProjectLogoPolkadotDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoPolkadotDark"),
);
const ProjectLogoPolkadotLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoPolkadotLight"),
);

// used for relay chain and system para chains
const polkadotCommonCfg = {
  identity: Chains.polkadot,
  symbol: "DOT",
  decimals: 10,
  ss58Format: 0,
  navLogo: ProjectLogoPolkadotLight,
  navLogoDark: ProjectLogoPolkadotDark,
  ...polkadotThemeVars,
};

export default polkadotCommonCfg;
