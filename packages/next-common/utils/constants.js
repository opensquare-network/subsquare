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
import darwinia2 from "./consts/settings/darwinia2";
// import moonbeam from "./consts/settings/moonbeam";
import moonriver from "./consts/settings/moonriver";
import bifrostPolkadot from "./consts/settings/bifrostPolkadot";
import vara from "./consts/settings/vara";
import isEvmChain from "./isEvmChain";

const optionalNodes =
  process.env.NEXT_PUBLIC_DEVELOPMENT === "true" ? [development] : [];

export const nodes = [
  polkadot,
  kusama,
  acala,
  altair,
  basilisk,
  bifrost,
  bifrostPolkadot,
  // calamari,
  centrifuge,
  collectives,
  // crab,
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
  moonriver,
  phala,
  // polkadex,
  turing,
  zeitgeist,
  rococo,
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
};

export const CHAIN = process.env.NEXT_PUBLIC_CHAIN;
/**
 * @deprecated use `CHAIN`
 */
export const chain = CHAIN;

export const IS_SERVER = typeof window === "undefined";

export const CONNECT_POPUP_VIEWS = {
  WEB3: "web3",
  EVM: "evm",
  ACCOUNT: "account",
};
export const CONNECT_POPUP_DEFAULT_VIEW = isEvmChain()
  ? CONNECT_POPUP_VIEWS.EVM
  : CONNECT_POPUP_VIEWS.WEB3;
