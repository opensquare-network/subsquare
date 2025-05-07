import polkadot from "./consts/settings/polkadot";
import kusama from "./consts/settings/kusama";
// import crab from "./consts/settings/crab";
import karura from "./consts/settings/karura";
import bifrost from "./consts/settings/bifrost";
import acala from "./consts/settings/acala";
import interlay from "./consts/settings/interlay";
import kintsugi from "./consts/settings/kintsugi";
import phala from "./consts/settings/phala";
import centrifuge from "./consts/settings/centrifuge";
// import kabocha from "./consts/settings/kabocha";
import crust from "./consts/settings/crust";
import litentry from "./consts/settings/litentry";
import basilisk from "./consts/settings/basilisk";
import hydradx from "./consts/settings/hydradx";
import development from "./consts/settings/development";
// import rococo from "./consts/settings/rococo";
import collectives from "./consts/settings/collectives";
// import moonbeam from "./consts/settings/moonbeam";
// import moonriver from "./consts/settings/moonriver";
import bifrostPolkadot from "./consts/settings/bifrostPolkadot";
import vara from "./consts/settings/vara";
import westend from "./consts/settings/westend";
import polkadotAssetHub from "next-common/utils/consts/settings/polkadotAssetHub";
import westendAssetHub from "next-common/utils/consts/settings/westendAssetHub";
import kusamaAssetHub from "next-common/utils/consts/settings/kusamaAssetHub";
import astar from "next-common/utils/consts/settings/astar";
import zkverifyTestnet from "./consts/settings/zkverifyTestnet";
import paseo from "./consts/settings/paseo";
import ajuna from "./consts/settings/ajuna";
import laos from "./consts/settings/laos";
import paseoAssetHub from "./consts/settings/paseoAssetHub";

const optionalNodes =
  process.env.NEXT_PUBLIC_DEVELOPMENT === "true" ? [development] : [];

export const nodes = [
  polkadot,
  polkadotAssetHub,
  kusama,
  kusamaAssetHub,
  acala,
  ajuna,
  astar,
  basilisk,
  bifrost,
  bifrostPolkadot,
  // calamari,
  centrifuge,
  collectives,
  // crab,
  westend,
  westendAssetHub,
  crust,
  hydradx,
  interlay,
  // kabocha,
  karura,
  kintsugi,
  laos,
  litentry,
  // moonbeam,
  // moonriver,
  phala,
  // polkadex,
  // rococo,
  // shibuya,
  vara,
  zkverifyTestnet,
  paseo,
  paseoAssetHub,
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
  multisigPromptVisible: "multisig-management-prompt-visible",

  walletConnectSession: "walletconnect-session",
};

export const ADDRESS_CACHE_KEYS = [
  CACHE_KEY.delegationPromptVisible,
  CACHE_KEY.setAvatarPromptVisible,
  CACHE_KEY.fellowshipDemotionExpiredVisible,
  CACHE_KEY.fellowshipDemotionExpireRemindVisible,
  CACHE_KEY.ambassadorDemotionExpiredVisible,
  CACHE_KEY.ambassadorDemotionExpireRemindVisible,
  CACHE_KEY.extensionUpdateMetadata,
  CACHE_KEY.assetHubPromptVisible,
  CACHE_KEY.multisigPromptVisible,
];

export const CHAIN = process.env.NEXT_PUBLIC_CHAIN;
/**
 * @deprecated use `CHAIN`
 */
export const chain = CHAIN;

export const IS_SERVER = typeof window === "undefined";
export const IS_PRODUCTION = process.env.NODE_ENV === "production";

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

export const NAV_MENU_TYPE = {
  main: "main",
  subspace: "subspace",
  archived: "archived",
};

export const RELATIONSHIP_NODE_TYPE = {
  Multisig: "Multisig",
  Proxy: "Proxy",
  Identity: "Identity",
};
