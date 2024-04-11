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
  WalletSignet,
} from "@osn/icons/subsquare";
import isMixedChain from "next-common/utils/isMixedChain";

const polkadotJs = {
  extensionName: WalletTypes.POLKADOT_JS,
  title: "Polkadot.js",
  installUrl:
    "https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd",
  logo: WalletPolkadotjs,
};

const subWalletJs = {
  extensionName: WalletTypes.SUBWALLET_JS,
  title: "SubWallet",
  installUrl:
    "https://chrome.google.com/webstore/detail/subwallet/onhogfjeacnfoofkfgppdlbmlmnplgbn",
  logo: WalletSubwallet,
};

const talisman = {
  extensionName: WalletTypes.TALISMAN,
  title: "Talisman",
  installUrl:
    "https://chrome.google.com/webstore/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld",
  logo: WalletTailsman,
};

const metamask = {
  extensionName: WalletTypes.METAMASK,
  title: "MetaMask",
  installUrl:
    "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
  logo: WalletMetamask,
};

const polkagate = {
  extensionName: WalletTypes.POLKAGATE,
  title: "PolkaGate",
  installUrl:
    "https://chrome.google.com/webstore/detail/polkagate-the-gateway-to/ginchbkmljhldofnbjabmeophlhdldgp",
  logo: WalletPolkagate,
};

const nova = {
  extensionName: WalletTypes.NOVA,
  title: "Nova",
  installUrl: "https://novawallet.io/",
  logo: WalletNova,
};

const mimir = {
  extensionName: WalletTypes.MIMIR,
  title: "Mimir",
  installUrl: "https://app.mimir.global/",
  logo: WalletMimir,
};

const signet = {
  extensionName: WalletTypes.SIGNET,
  title: "Signet",
  installUrl: "https://signet.talisman.xyz/",
  logo: WalletSignet,
};

export function getWallets() {
  if (isEvmChain()) {
    return [talisman, metamask, nova];
  } else if (isMixedChain()) {
    return [
      metamask,
      polkadotJs,
      subWalletJs,
      talisman,
      polkagate,
      nova,
      mimir,
    ];
  } else {
    return [polkadotJs, subWalletJs, talisman, polkagate, nova, mimir];
  }
}

export function getSingleSigWallets() {
  if (isEvmChain()) {
    return [talisman, metamask, nova];
  } else if (isMixedChain()) {
    return [metamask, polkadotJs, subWalletJs, talisman, polkagate, nova];
  } else {
    return [polkadotJs, subWalletJs, talisman, polkagate, nova];
  }
}

export function getMultiSigWallets() {
  if (isEvmChain()) {
    return [];
  }
  return [mimir, signet];
}
