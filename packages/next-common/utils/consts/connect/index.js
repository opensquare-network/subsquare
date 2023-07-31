import WalletTypes from "../walletTypes";
import isEvmChain from "next-common/utils/isEvmChain";
import {
  WalletMetamask,
  WalletNova,
  WalletPolkadotjs,
  WalletPolkagate,
  WalletSubwallet,
  WalletTailsman,
} from "@osn/icons/subsquare";

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

export function getWallets() {
  if (isEvmChain()) {
    return [talisman, metamask, nova];
  }

  return [polkadotJs, subWalletJs, talisman, polkagate, nova];
}
