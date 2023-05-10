import PolkadotLogo from "../../../assets/icons/wallet/polkadot.svg";
import SubWalletLogo from "../../../assets/icons/wallet/subWallet.svg";
import TalismanLogo from "../../../assets/icons/wallet/talisman.svg";
import MetaMaskLogo from "../../../assets/icons/wallet/metamask.svg";
import Chains from "../chains";

const polkadotJs = {
  extensionName: "polkadot-js",
  title: "Polkadot.js",
  installUrl:
    "https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd",
  logo: PolkadotLogo,
};

const subWalletJs = {
  extensionName: "subwallet-js",
  title: "SubWallet",
  installUrl:
    "https://chrome.google.com/webstore/detail/subwallet/onhogfjeacnfoofkfgppdlbmlmnplgbn",
  logo: SubWalletLogo,
};

const talisman = {
  extensionName: "talisman",
  title: "Talisman",
  installUrl:
    "https://chrome.google.com/webstore/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld",
  logo: TalismanLogo,
};

const metamask = {
  extensionName: "metamask",
  title: "MetaMask",
  installUrl:
    "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
  logo: MetaMaskLogo,
};

export function getWallets() {
  if (process.env.NEXT_PUBLIC_CHAIN === Chains.darwinia2) {
    return [talisman, metamask];
  }

  return [polkadotJs, subWalletJs, talisman];
}
