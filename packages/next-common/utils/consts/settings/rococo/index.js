import dynamic from "next/dynamic";
import { polkadotThemeVars } from "next-common/utils/consts/settings/common/polkadot";
import rococoTreasuryTracks from "next-common/utils/consts/settings/rococo/tracks";
import capitalize from "../../../capitalize";
import Chains from "../../chains";
import { defaultPostLabels } from "../common";
import MenuGroups from "../menuGroups";

const ProjectIconRococoDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconRococoDark"),
);
const ProjectIconRococoLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconRococoLight"),
);
const ProjectLogoRococoDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoRococoDark"),
);
const ProjectLogoRococoLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoRococoLight"),
);

export const defaultRococoNodes = [
  {
    name: "Parity",
    url: "wss://rococo-rpc.polkadot.io",
  },
];

const name = Chains.rococo;

const links = [
  {
    name: "github",
    url: "https://github.com/paritytech/polkadot",
  },
];

const rococo = {
  value: name,
  name: capitalize(name),
  identity: name,
  symbol: "ROC",
  decimals: 12,
  hasElections: true,
  ss58Format: 42,
  blockTime: 6000,
  snsCoverCid: "bafybeia7np32r7cq2ykeeopfyxfgxhhsi2e4tl4bew4zjwu2zixiw2rx74",
  endpoints: defaultRococoNodes,
  avatar: ProjectIconRococoLight,
  darkAvatar: ProjectIconRococoDark,
  navLogo: ProjectLogoRococoLight,
  navLogoDark: ProjectLogoRococoDark,
  links,
  group: MenuGroups.Solochain,
  postLabels: defaultPostLabels,
  hasTipsModule: false,
  hasSubscan: true,
  hasDiscussionsForumTopics: true,
  discourseForumLink: "https://forum.polkadot.network",
  description: "Polkadot’s Parachain Testnet",
  ...polkadotThemeVars,
  modules: {
    referenda: true,
    fellowship: true,
  },
  multisigWallets: {
    signet: true,
    mimir: true,
  },
  treasuryProposalTracks: rococoTreasuryTracks,
};

export default rococo;
