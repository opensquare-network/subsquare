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
import getChainSettings from "../settings";

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

export const allWallets = [
  polkadotJs,
  subWalletJs,
  talisman,
  metamask,
  nova,
  mimir,
  signet,
];

export function getWallets() {
  return [...getSingleSigWallets(), ...getMultiSigWallets()];
}

export function getSingleSigWallets() {
  return [polkadotJs, subWalletJs, talisman, polkagate, nova];
}

export function getMultiSigWallets() {
  let result = [];
  if (isEvmChain()) {
    return result;
  }

  const chainSetting = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (chainSetting?.multisigWallets?.signet) {
    result.push(signet);
  }
  if (chainSetting?.multisigWallets?.mimir) {
    result.push(mimir);
  }

  return result;
}
