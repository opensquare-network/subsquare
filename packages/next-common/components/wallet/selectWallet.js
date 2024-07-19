import SubstrateWallet from "./substrateWallet";
import { NovaWallet } from "./novaWallet";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { noop } from "lodash-es";
import { SignetWallet } from "./signetWallet";
import WalletOption from "./walletOption";
import PolkagateSnapWallet from "./polkagateSnapWallet";
import MimirWallet from "./mimirWallet";

export default function SelectWallet({
  wallets,
  selectedWallet,
  setSelectedWallet,
  onSelect = noop,
  beforeWallets,
  extraWallets,
}) {
  function handleClick(wallet) {
    onSelect(wallet);
  }

  return (
    <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-2">
      {beforeWallets}

      {(wallets || []).map((wallet, index) => {
        // evm
        if (wallet.connector) {
          let icon;
          if (wallet.logo) {
            icon = <wallet.logo className="w-6 h-6" />;
          } else if (wallet.connector?.icon) {
            icon = <img src={wallet.connector?.icon} className="w-6 h-6" />;
          }

          const installed = !!wallet.connector;

          return (
            <WalletOption
              key={wallet.connector.id}
              installed={installed}
              logo={icon}
              title={wallet.title}
              selected={selectedWallet?.connector?.id === wallet.connector?.id}
              onClick={() => {
                if (!installed) {
                  return;
                }

                handleClick(wallet);
              }}
            />
          );
        }

        // substrate
        const selected = wallet.extensionName === selectedWallet?.extensionName;

        if (wallet.extensionName === WalletTypes.NOVA) {
          return (
            <NovaWallet
              key={index}
              wallet={wallet}
              onClick={async () => {
                setSelectedWallet(wallet);
                handleClick(wallet);
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
                setSelectedWallet(wallet);
                handleClick(wallet);
              }}
              selected={selected}
            />
          );
        }

        if (wallet.extensionName === WalletTypes.POLKAGATE_SNAP) {
          return (
            <PolkagateSnapWallet
              key={index}
              wallet={wallet}
              onClick={async () => {
                setSelectedWallet(wallet);
                handleClick(wallet);
              }}
              selected={selected}
            />
          );
        }

        if (wallet.extensionName === WalletTypes.MIMIR) {
          return (
            <MimirWallet
              key={index}
              wallet={wallet}
              onClick={() => {
                setSelectedWallet(wallet);
                handleClick(wallet);
              }}
              selected={selected}
            />
          );
        }

        return (
          <SubstrateWallet
            key={index}
            wallet={wallet}
            onClick={async () => {
              setSelectedWallet(wallet);
              handleClick(wallet);
            }}
            selected={selected}
          />
        );
      })}

      {extraWallets}
    </div>
  );
}
