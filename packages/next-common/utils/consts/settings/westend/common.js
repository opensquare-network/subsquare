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

export default westendCommonCfg;
