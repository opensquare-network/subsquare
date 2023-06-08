import PolkadotLogo from "../../../assets/icons/wallet/polkadot.svg";
import SubWalletLogo from "../../../assets/icons/wallet/subWallet.svg";
import TalismanLogo from "../../../assets/icons/wallet/talisman.svg";
import MetaMaskLogo from "../../../assets/icons/wallet/metamask.svg";
import Chains from "../chains";
import WalletTypes from "../walletTypes";

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
  if (
    [
      Chains.darwinia2,
      Chains.moonbeam,
      Chains.moonriver,
    ].includes(process.env.NEXT_PUBLIC_CHAIN)
  ) {
    return [talisman, metamask];
  }

  return [polkadotJs, subWalletJs, talisman];
}
