import polkadot from "./consts/settings/polkadot";
import kusama from "./consts/settings/kusama";
import crab from "./consts/settings/crab";
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

/**
 * left + gap + main content
 */
export const pageMaxWidth = 1184;

/**
 * home layout main content width
 */
export const pageHomeLayoutMainContentWidth = 932;

const optionalNodes =
  process.env.NEXT_PUBLIC_DEVELOPMENT === "true" ? [development] : [];

export const nodes = [
  polkadot,
  kusama,
  acala,
  altair,
  basilisk,
  bifrost,
  // calamari,
  centrifuge,
  crab,
  crust,
  hydradx,
  interlay,
  litentry,
  // kabocha,
  karura,
  khala,
  kintsugi,
  litmus,
  phala,
  // polkadex,
  turing,
  zeitgeist,
  rococo,
  westendCollectives,
  ...optionalNodes,
];

export const EmptyList = {
  total: 0,
  page: 1,
  pageSize: 10,
  items: [],
};

export const defaultBlockTime = 12000;

export const DEFAULT_SEO_INFO = {
  title: `SubSquare`,
  desc: `A platform that scans and normalizes the blockchain governance data. It enables community members to propose, vote proposals and discuss the corresponding topics.`,
};

export const BalanceDecimals = {
  DOT: 2,
  KSM: 2,
};

export const CACHE_KEY = {
  lastLoginAddress: "lastLoggedInAddress",
  lastLoginExtension: "lastLoginExtension",
  accountMap: "accountMap",
  themeMode: "theme-mode",
  authToken: "auth-token",
  homeFoldedMenus: "home-folded-menus",
  acceptCookies: "accept-cookies",
  dontRemindEmail: "dont-remind-email",
};

export const chain = process.env.NEXT_PUBLIC_CHAIN;
