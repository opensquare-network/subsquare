import polkadot from "./consts/settings/polkadot";
import kusama from "./consts/settings/kusama";
// import crab from "./consts/settings/crab";
import karura from "./consts/settings/karura";
import bifrost from "./consts/settings/bifrost";
import acala from "./consts/settings/acala";
import interlay from "./consts/settings/interlay";
import kintsugi from "./consts/settings/kintsugi";
import khala from "./consts/settings/khala";
import phala from "./consts/settings/phala";
import turing from "./consts/settings/turing";
import centrifuge from "./consts/settings/centrifuge";
// import kabocha from "./consts/settings/kabocha";
import crust from "./consts/settings/crust";
import litmus from "./consts/settings/litmus";
import litentry from "./consts/settings/litentry";
import zeitgeist from "./consts/settings/zeitgeist";
import altair from "./consts/settings/altair";
import basilisk from "./consts/settings/basilisk";
import hydradx from "./consts/settings/hydradx";
import development from "./consts/settings/development";
import rococo from "./consts/settings/rococo";
import westendCollectives from "./consts/settings/westendCollectives";
import collectives from "./consts/settings/collectives";
import darwinia2 from "./consts/settings/darwinia";
// import moonbeam from "./consts/settings/moonbeam";
// import moonriver from "./consts/settings/moonriver";
import bifrostPolkadot from "./consts/settings/bifrostPolkadot";
import vara from "./consts/settings/vara";
import westend from "./consts/settings/westend";
import polkadotAssetHub from "next-common/utils/consts/settings/polkadotAssetHub";
import shibuya from "next-common/utils/consts/settings/shibuya";
import astar from "next-common/utils/consts/settings/astar";

const optionalNodes =
  process.env.NEXT_PUBLIC_DEVELOPMENT === "true" ? [development] : [];

export const nodes = [
  polkadot,
  polkadotAssetHub,
  kusama,
  acala,
  altair,
  astar,
  basilisk,
  bifrost,
  bifrostPolkadot,
  // calamari,
  centrifuge,
  collectives,
  // crab,
  westend,
  westendCollectives,
  crust,
  darwinia2,
  hydradx,
  interlay,
  // kabocha,
  karura,
  khala,
  kintsugi,
  litentry,
  litmus,
  // moonbeam,
  // moonriver,
  phala,
  // polkadex,
  rococo,
  shibuya,
  turing,
  zeitgeist,
  vara,
  ...optionalNodes,
];

export const EmptyList = {
  total: 0,
  page: 1,
  pageSize: 10,
  items: [],
};

export const defaultBlockTime = 12000;

export const defaultPageSize = 25;

export const DEFAULT_SEO_INFO = {
  title: "SubSquare | governance platform",
  desc: "A platform that scans and normalizes the blockchain governance data. It enables community members to propose, vote proposals and discuss the corresponding topics.",
};

export const BalanceDecimals = {
  DOT: 2,
  KSM: 2,
};

export const CACHE_KEY = {
  lastConnectedAccount: "lastConnectedAddress",

  // @deprecated
  // use `lastConnectedAccount` instead
  // following 2 keys are for migration purpose only
  lastLoggedInAddress: "lastLoggedInAddress",
  lastLoginExtension: "lastLoginExtension",

  themeMode: "theme-mode",
  authToken: "auth-token",
  acceptCookies: "accept-cookies",
  navCollapsed: "nav-collapsed",
  navSubmenuVisible: "nav-submenu-visible",
  connectedAccount: "connected-account",
  delegationPromptVisible: "delegation-prompt-visible",
  setAvatarPromptVisible: "set-avatar-prompt-visible",
  fellowshipDemotionExpiredVisible: "fellowship-demotion-expired-visible",
  fellowshipDemotionExpireRemindVisible:
    "fellowship-demotion-expire-remind-visible",
  ambassadorDemotionExpiredVisible: "ambassador-demotion-expired-visible",
  ambassadorDemotionExpireRemindVisible:
    "ambassador-demotion-expire-remind-visible",
  extensionUpdateMetadata: "extensionUpdateMetadata",
  assetHubPromptVisible: "asset-hub-management-prompt-visible",
};

export const CHAIN = process.env.NEXT_PUBLIC_CHAIN;
/**
 * @deprecated use `CHAIN`
 */
export const chain = CHAIN;

export const IS_SERVER = typeof window === "undefined";

export const WALLET_TIMEOUT_ERROR_TEXT =
  "The wallet request timed out. Please refresh the page and try again later.";

export const ONE_DAY = 24 * 60 * 60 * 1000;

export const FELLOWSHIP_RANK_LEVEL_NAMES = [
  "Candidates",
  "Member",
  "Proficient",
  "Fellow",
  "Architect",
  "Architect Adept",
  "Grand Architect",
  "Free Master",
  "Master Constant",
  "Grand Master",
];
