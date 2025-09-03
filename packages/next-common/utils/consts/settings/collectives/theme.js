import dynamic from "next/dynamic";
import { polkadotThemeVars } from "next-common/utils/consts/settings/common/polkadot";

const ProjectIconPolkadotCollectivesDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPolkadotCollectivesDark"),
);
const ProjectIconPolkadotCollectivesLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPolkadotCollectivesLight"),
);
const ProjectLogoPolkadotCollectivesDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoPolkadotCollectivesDark"),
);
const ProjectLogoPolkadotCollectivesLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoPolkadotCollectivesLight"),
);

export const collectivesThemes = {
  ...polkadotThemeVars,
  avatar: ProjectIconPolkadotCollectivesLight,
  darkAvatar: ProjectIconPolkadotCollectivesDark,
  navLogo: ProjectLogoPolkadotCollectivesLight,
  navLogoDark: ProjectLogoPolkadotCollectivesDark,
};
