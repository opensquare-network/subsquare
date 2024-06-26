import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { defaultPostLabels } from "next-common/utils/consts/settings/common";
import MenuGroups from "next-common/utils/consts/settings/menuGroups";
import polkadotLinks from "next-common/utils/consts/settings/polkadot/links";
import { westendThemeVars } from "next-common/utils/consts/settings/westend/theme";
import capitalize from "../../../capitalize";
import Chains from "../../chains";
import defaultWestendNodes from "./nodes";

const ProjectIconWestendDark = dynamicClientOnly(() =>
  import("@osn/icons/subsquare/ProjectIconWestendDark"),
);
const ProjectIconWestendLight = dynamicClientOnly(() =>
  import("@osn/icons/subsquare/ProjectIconWestendLight"),
);
const ProjectLogoWestendDark = dynamicClientOnly(() =>
  import("@osn/icons/subsquare/ProjectLogoWestendDark"),
);
const ProjectLogoWestendLight = dynamicClientOnly(() =>
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
  snsCoverCid: "bafybeieg5vzoxvc7darffapxi7qx4sb5gljlr7qbgu43lp7patayt6zitq",
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
};

export default westend;
