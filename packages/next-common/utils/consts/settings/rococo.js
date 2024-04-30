import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import Chains from "../chains";
import { defaultPostLabels } from "./common";
import {
  ProjectIconRococoDark,
  ProjectIconRococoLight,
  ProjectLogoRococoDark,
  ProjectLogoRococoLight,
} from "@osn/icons/subsquare";
import { polkadotThemeVars } from "next-common/utils/consts/settings/common/polkadot";

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

const treasuryProposalTracks = [
  {
    id: 30,
    name: "Small Tipper",
    max: 1,
  },
  {
    id: 31,
    name: "Big Tipper",
    max: 5,
  },
  {
    id: 32,
    name: "Small Spender",
    max: 50,
  },
  {
    id: 33,
    name: "Medium Spender",
    max: 500,
  },
  {
    id: 34,
    name: "Big Spender",
    max: 5000,
  },
  {
    id: 11,
    name: "Treasurer",
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
  treasuryProposalTracks,
};

export default rococo;
