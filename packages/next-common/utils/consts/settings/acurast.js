import MenuGroups from "./menuGroups";
import dynamic from "next/dynamic";
import { mergeChainModules } from "./common/modules";

const ProjectIconAcurastDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconAcurastDark"),
);
const ProjectIconAcurastLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconAcurastLight"),
);
const ProjectLogoAcurastDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoAcurastDark"),
);
const ProjectLogoAcurastLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoAcurastLight"),
);

const endpoints = [
  {
    name: "Acurast",
    url: "wss://public-archive.mainnet.acurast.com",
  },
];

const links = [
  {
    name: "website",
    url: "https://acurast.com",
  },
  {
    name: "telegram",
    url: "https://t.me/acurastnetwork",
  },
  {
    name: "twitter",
    url: "https://x.com/@acurast",
  },
  {
    name: "discord",
    url: "https://discord.com/invite/acurast",
  },
  {
    name: "github",
    url: "https://github.com/acurast",
  },
];

const kintsugi = {
  value: "acurast",
  name: "Acurast",
  identity: "acurast",
  symbol: "ACU",
  decimals: 12,
  blockTime: 6000,
  ss58Format: 42,
  endpoints,
  avatar: ProjectIconAcurastLight,
  darkAvatar: ProjectIconAcurastDark,
  navLogo: ProjectLogoAcurastLight,
  navLogoDark: ProjectLogoAcurastDark,
  navPreferDark: true,
  links,
  group: MenuGroups.PolkadotAndParachains,
  description:
    "Acurast is the real Decentralized Compute Network—Scalable, Secure, and Powered by Smartphones. No reliance on centralized servers.",
  useVoteCall: true,
  modules: mergeChainModules({
    referenda: true,
    democracy: false,
    treasury: {
      bounties: false,
      tips: false,
      spends: true,
    },
    technicalCommittee: false,
    advanced: {
      data: false,
    },
    proxy: false,
  }),
  integrations: {
    subscan: true,
  },
  cssVarsLight: {
    theme100: "rgba(192,231, 0,0.10)",
    theme300: "rgba(192,231, 0,0.40)",
    theme500: "rgba(192,231, 0,1)",
    navigationBg: "rgba(0,0,0,1)",
    navigationActive: "rgba(255,255,255,0.06)",
    navigationBorder: "rgba(255,255,255,0.08)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(192,231, 0,0.10)",
    theme300: "rgba(192,231, 0,0.40)",
    theme500: "rgba(192,231, 0,1)",
    navigationBg: "rgba(0,0,0,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
  wallets: {
    walletconnect: false,
  },
  multisigWallets: {
    signet: true,
  },
  allowWeb2Login: true,
};

export default kintsugi;
