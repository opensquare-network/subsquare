import WalletTypes from "../walletTypes";
import {
  WalletMetamask,
  WalletMimir,
  WalletNova,
  WalletPolkadotjs,
  WalletPolkagate,
  WalletPolkagateSnap,
  WalletSubwallet,
  WalletTailsman,
  WalletSignet,
  WalletPhantom,
  WalletOkx,
  WalletCoinbase,
  WalletWalletconnect,
} from "@osn/icons/subsquare";

export const polkadotJs = {
  extensionName: WalletTypes.POLKADOT_JS,
  title: "Polkadot.js",
  installUrl:
    "https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd",
  logo: WalletPolkadotjs,
};

export const subWallet = {
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

export const polkagateSnap = {
  extensionName: WalletTypes.POLKAGATE_SNAP,
  title: "PolkaGate Snap",
  installUrl: "https://snaps.metamask.io/snap/npm/polkagate/snap/",
  logo: WalletPolkagateSnap,
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
  installUrl: "https://mimir.global/",
  logo: WalletMimir,
};

export const signet = {
  extensionName: WalletTypes.SIGNET,
  title: "Signet",
  installUrl: "https://www.talisman.xyz/signet",
  logo: WalletSignet,
};

export const phantom = {
  extensionName: WalletTypes.PHANTOM,
  title: "Phantom",
  installUrl: "https://phantom.app/",
  logo: WalletPhantom,
};

export const okxWallet = {
  extensionName: WalletTypes.OKX_WALLET,
  title: "OKX Wallet",
  installUrl: "https://www.okx.com/web3",
  logo: WalletOkx,
};

export const coinbaseWallet = {
  extensionName: WalletTypes.COINBASE_WALLET,
  title: "Coinbase Wallet",
  installUrl: "https://www.coinbase.com/wallet/downloads",
  logo: WalletCoinbase,
};

export const walletConnect = {
  extensionName: WalletTypes.WALLET_CONNECT,
  title: "WalletConnect",
  installUrl: "https://walletconnect.network/",
  logo: WalletWalletconnect,
};

export const allWallets = [
  polkadotJs,
  subWallet,
  talisman,
  metamask,
  polkagate,
  polkagateSnap,
  nova,
  mimir,
  signet,
  phantom,
  okxWallet,
  coinbaseWallet,
  walletConnect,
];
