import PolkadotLogo from "../../../assets/icons/wallet/polkadot.svg";
import SubWalletLogo from "../../../assets/icons/wallet/subWallet.svg";
import TalismanLogo from "../../../assets/icons/wallet/talisman.svg";
import Chains from "../chains";

export const WALLETS = [
  {
    extensionName: "polkadot-js",
    title: "Polkadot.js",
    installUrl:
      "https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd",
    logo: PolkadotLogo,
  },
  {
    extensionName: "subwallet-js",
    title: "SubWallet",
    installUrl:
      "https://chrome.google.com/webstore/detail/subwallet/onhogfjeacnfoofkfgppdlbmlmnplgbn",
    logo: SubWalletLogo,
  },
  {
    extensionName: "talisman",
    title: "Talisman",
    installUrl:
      "https://chrome.google.com/webstore/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld",
    logo: TalismanLogo,
  },
];

export function getWallets() {
  if (process.env.NEXT_PUBLIC_CHAIN === Chains.darwinia2) {
    return WALLETS.filter((wallet) => wallet.extensionName !== "polkadot-js");
  }
  return WALLETS;
}
