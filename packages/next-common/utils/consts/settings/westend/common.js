import dynamic from "next/dynamic";
import Chains from "next-common/utils/consts/chains";
import { westendThemeVars } from "next-common/utils/consts/settings/westend/theme";

const ProjectLogoWestendLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoWestendLight"),
);
const ProjectLogoWestendDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoWestendDark"),
);

const westendCommonCfg = {
  identity: Chains.westend,
  symbol: "WND",
  decimals: 12,
  ss58Format: 42,
  navLogo: ProjectLogoWestendLight,
  navLogoDark: ProjectLogoWestendDark,
  ...westendThemeVars,
};

export const subscanWestendAssethubDomain = "assethub-westend";
export const statescanWestendAssethubDomain = "assethub-westend";

export const westendAssethubMigration = {
  migrated: true,
  timestamp: 1747307424000,
  subscanAssethubDomain: subscanWestendAssethubDomain,
  statescanAssethubDomain: statescanWestendAssethubDomain,
  relayBlockTime: 6000,
};

export default westendCommonCfg;
