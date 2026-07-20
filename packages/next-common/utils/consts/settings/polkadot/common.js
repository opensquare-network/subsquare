import dynamic from "next/dynamic";
import Chains from "next-common/utils/consts/chains";
import { polkadotThemeVars } from "next-common/utils/consts/settings/common/polkadot";

const ProjectLogoPolkadotDark = dynamic(() =>
  import("./icons").then((m) => m.ProjectLogoPolkadotDark),
);
const ProjectLogoPolkadotLight = dynamic(() =>
  import("./icons").then((m) => m.ProjectLogoPolkadotLight),
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

export const subscanPolkadotAssethubDomain = "assethub-polkadot";
export const statescanPolkadotAssethubDomain = "assethub-polkadot";

export const polkadotAssethubMigration = {
  migrated: true,
  timestamp: 1762239840000,
  subscanAssethubDomain: subscanPolkadotAssethubDomain,
  statescanAssethubDomain: statescanPolkadotAssethubDomain,
  statescanAssethubApiDomain: "ahp",
  relayBlockTime: 6000,
  graphqlApiSubDomain: "ahp-gh-api",
};
