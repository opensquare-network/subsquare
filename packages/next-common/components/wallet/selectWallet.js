import PolkadotWallet from "./polkadotWallet";
import { MetaMaskWallet } from "./metamaskWallet";
import { NovaWallet } from "./novaWallet";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { noop } from "lodash-es";
import { SignetWallet } from "./signetWallet";

export default function SelectWallet({
  wallets,
  selectedWallet,
  setSelectWallet,
  onSelect = noop,
  extraWallets,
}) {
  return (
    <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-2">
      {(wallets || []).map((wallet, index) => {
        const selected = wallet.extensionName === selectedWallet;

        if (wallet.extensionName === WalletTypes.METAMASK) {
          return (
            <MetaMaskWallet
              key={index}
              wallet={wallet}
              onClick={async () => {
                setSelectWallet(wallet?.extensionName);
                onSelect();
              }}
              selected={selected}
            />
          );
        }

        if (wallet.extensionName === WalletTypes.NOVA) {
          return (
            <NovaWallet
              key={index}
              wallet={wallet}
              onClick={async () => {
                setSelectWallet(wallet?.extensionName);
                onSelect();
              }}
              selected={selected}
            />
          );
        }

        if (wallet.extensionName === WalletTypes.SIGNET) {
          return (
            <SignetWallet
              key={index}
              wallet={wallet}
              onClick={async () => {
                setSelectWallet(wallet?.extensionName);
                onSelect();
              }}
              selected={selected}
            />
          );
        }

        return (
          <PolkadotWallet
            key={index}
            wallet={wallet}
            onClick={async () => {
              setSelectWallet(wallet?.extensionName);
              onSelect();
            }}
            selected={selected}
          />
        );
      })}

      {extraWallets}
    </div>
  );
}
