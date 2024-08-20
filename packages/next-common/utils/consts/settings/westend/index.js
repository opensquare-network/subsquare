import dynamic from "next/dynamic";
import { defaultPostLabels } from "next-common/utils/consts/settings/common";
import MenuGroups from "next-common/utils/consts/settings/menuGroups";
import polkadotLinks from "next-common/utils/consts/settings/polkadot/links";
import { westendThemeVars } from "next-common/utils/consts/settings/westend/theme";
import capitalize from "../../../capitalize";
import Chains from "../../chains";
import defaultWestendNodes from "./nodes";

const ProjectIconWestendDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconWestendDark"),
);
const ProjectIconWestendLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconWestendLight"),
);
const ProjectLogoWestendDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoWestendDark"),
);
const ProjectLogoWestendLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoWestendLight"),
);

const name = Chains.westend;

const westend = {
  value: name,
  name: capitalize(name),
  identity: name,
  symbol: "WND",
  decimals: 12,
  ss58Format: 42,
  blockTime: 6000,
  endpoints: defaultWestendNodes,
  avatar: ProjectIconWestendLight,
  darkAvatar: ProjectIconWestendDark,
  navLogo: ProjectLogoWestendLight,
  navLogoDark: ProjectLogoWestendDark,
  group: MenuGroups.WestendAndParachains,
  links: polkadotLinks,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  description: "Westend is the primary test network of Polkadot.",
  ...westendThemeVars,
  modules: {
    referenda: true,
  },
  newProposalQuickStart: {
    cancelReferendum: true,
    killReferendum: true,
  },
  disableWeb2Registration: true,
  sima: true,
};

export default westend;
