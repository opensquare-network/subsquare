import PolkadotLogo from "../../../assets/icons/wallet/polkadot.svg";
import SubWalletLogo from "../../../assets/icons/wallet/subWallet.svg";
import TalismanLogo from "../../../assets/icons/wallet/talisman.svg";
import MetaMaskLogo from "../../../assets/icons/wallet/metamask.svg";
import WalletTypes from "../walletTypes";
import isEvmChain from "next-common/utils/isEvmChain";
import hasDispatchPrecompile from "next-common/utils/hasDispatchPrecompile";

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

export function getWallets() {
  if (isEvmChain()) {
    if (hasDispatchPrecompile()) {
      return [talisman, metamask];
    }
    return [talisman];
  }

  return [polkadotJs, subWalletJs, talisman];
}
