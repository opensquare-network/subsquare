import PolkadotLogo from "../../../assets/icons/wallet/polkadot.svg";
import SubWalletLogo from "../../../assets/icons/wallet/subWallet.svg";
import TalismanLogo from "../../../assets/icons/wallet/talisman.svg";
import MetaMaskLogo from "../../../assets/icons/wallet/metamask.svg";
import PolkagateLogo from "../../../assets/icons/wallet/polkagate.svg";
import NovaLogo from "../../../assets/icons/wallet/nova.svg";
import WalletTypes from "../walletTypes";
import isEvmChain from "next-common/utils/isEvmChain";

const polkadotJs = {
  extensionName: WalletTypes.POLKADOT_JS,
  title: "Polkadot.js",
  installUrl:
    "https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd",
  logo: PolkadotLogo,
};

const subWalletJs = {
  extensionName: WalletTypes.SUBWALLET_JS,
  title: "SubWallet",
  installUrl:
    "https://chrome.google.com/webstore/detail/subwallet/onhogfjeacnfoofkfgppdlbmlmnplgbn",
  logo: SubWalletLogo,
};

const talisman = {
  extensionName: WalletTypes.TALISMAN,
  title: "Talisman",
  installUrl:
    "https://chrome.google.com/webstore/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld",
  logo: TalismanLogo,
};

const metamask = {
  extensionName: WalletTypes.METAMASK,
  title: "MetaMask",
  installUrl:
    "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
  logo: MetaMaskLogo,
};

const polkagate = {
  extensionName: WalletTypes.POLKAGATE,
  title: "PolkaGate",
  installUrl:
    "https://chrome.google.com/webstore/detail/polkagate-the-gateway-to/ginchbkmljhldofnbjabmeophlhdldgp",
  logo: PolkagateLogo,
};

const nova = {
  extensionName: WalletTypes.NOVA,
  title: "Nova",
  installUrl: "https://novawallet.io/",
  logo: NovaLogo,
};

export function getWallets() {
  if (isEvmChain()) {
    return [talisman, metamask, nova];
  }

  return [polkadotJs, subWalletJs, talisman, polkagate, nova];
}
