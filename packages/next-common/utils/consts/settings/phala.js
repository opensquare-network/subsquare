import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import {
  ProjectIconPhalaDark,
  ProjectIconPhalaLight,
  ProjectLogoPhalaDark,
} from "@osn/icons/subsquare";

const DEFAULT_PHALA_NODES = [
  {
    name: "Dwellir",
    url: "wss://phala-rpc.dwellir.com",
  },
  {
    name: "Phala",
    url: "wss://api.phala.network/ws",
  },
  {
    name: "OnFinality",
    url: "wss://phala.api.onfinality.io/public-ws",
  },
];

const links = [
  {
    name: "website",
    url: "https://phala.network",
  },
  {
    name: "twitter",
    url: "https://twitter.com/phalanetwork",
  },
  {
    name: "youtube",
    url: "https://www.youtube.com/@PhalaNetwork",
  },
  {
    name: "telegram",
    url: "https://t.me/phalanetwork",
  },
  {
    name: "discord",
    url: "https://discord.gg/gZjZuVHXtm",
  },
  {
    name: "github",
    url: "https://github.com/phala-network",
  },
];

const phala = {
  value: "phala",
  name: "Phala",
  identity: "phala",
  symbol: "PHA",
  decimals: 12,
  blockTime: 12000,
  hasElections: true,
  ss58Format: 30,
  snsCoverCid: "bafybeibte36v2qk5wg352hk7ewvkuhoke6iwb7l5gvjt7wy446yayxjie4",
  endpoints: DEFAULT_PHALA_NODES,
  avatar: ProjectIconPhalaLight,
  darkAvatar: ProjectIconPhalaDark,
  navLogo: ProjectLogoPhalaDark,
  navLogoDark: ProjectLogoPhalaDark,
  navPreferDark: true,
  links,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  description:
    "Phala Network, an off-chain compute network powered by Secure Enclaves, can be utilized to build the MEV core stack with minimal trust assumptions.",
  useVoteCall: true,
  hasMultisig: true,
  multisigApiPrefix: "phala",
  modules: {
    democracy: true,
  },
  cssVarsLight: {
    theme100: "rgba(192,236,69,0.10)",
    theme300: "rgba(192,236,69,0.40)",
    theme500: "rgba(192,236,69,1)",
    navigationBg: "rgba(0,0,0,1)",
    navigationActive: "rgba(255,255,255,0.10)",
    navigationBorder: "rgba(255,255,255,0.12)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(192,236,69,0.10)",
    theme300: "rgba(192,236,69,0.40)",
    theme500: "rgba(192,236,69,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "rgba(39,42,58,1)",
  },
  multisigWallets: {
    signet: true,
  },
};

export default phala;
