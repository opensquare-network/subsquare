import WalletTypes from "../walletTypes";
import isEvmChain from "next-common/utils/isEvmChain";
import {
  WalletMetamask,
  WalletMimir,
  WalletNova,
  WalletPolkadotjs,
  WalletPolkagate,
  WalletSubwallet,
  WalletTailsman,
} from "@osn/icons/subsquare";
import isMixedChain from "next-common/utils/isMixedChain";

export const polkadotJs = {
  extensionName: WalletTypes.POLKADOT_JS,
  title: "Polkadot.js",
  installUrl:
    "https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd",
  logo: WalletPolkadotjs,
};

export const subWalletJs = {
  extensionName: WalletTypes.SUBWALLET_JS,
  title: "SubWallet",
  installUrl:
    "https://chrome.google.com/webstore/detail/subwallet/onhogfjeacnfoofkfgppdlbmlmnplgbn",
  logo: WalletSubwallet,
};

export const talisman = {
  extensionName: WalletTypes.TALISMAN,
  title: "Talisman",
  installUrl:
    "https://chrome.google.com/webstore/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld",
  logo: WalletTailsman,
};

export const metamask = {
  extensionName: WalletTypes.METAMASK,
  title: "MetaMask",
  installUrl:
    "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
  logo: WalletMetamask,
};

export const polkagate = {
  extensionName: WalletTypes.POLKAGATE,
  title: "PolkaGate",
  installUrl:
    "https://chrome.google.com/webstore/detail/polkagate-the-gateway-to/ginchbkmljhldofnbjabmeophlhdldgp",
  logo: WalletPolkagate,
};

export const nova = {
  extensionName: WalletTypes.NOVA,
  title: "Nova",
  installUrl: "https://novawallet.io/",
  logo: WalletNova,
};

export const mimir = {
  extensionName: WalletTypes.MIMIR,
  title: "Mimir",
  installUrl: "https://app.mimir.global/",
  logo: WalletMimir,
};

export const evmWallets = [talisman, metamask, nova];
export const substrateWallets = [
  polkadotJs,
  subWalletJs,
  talisman,
  polkagate,
  nova,
];

export function getWallets() {
  if (isEvmChain()) {
    return evmWallets;
  } else if (isMixedChain()) {
    return [metamask, ...substrateWallets, mimir];
  } else {
    return [...substrateWallets, mimir];
  }
}
