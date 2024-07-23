import { noop } from "lodash-es";
import WalletOption from "next-common/components/wallet/walletOption";
import { WalletGroupTitle, WalletOptionsWrapper } from "./styled";
import { useEVMWallets } from "next-common/hooks/connect/useEVMWallets";
import isMixedChain from "next-common/utils/isMixedChain";
import BackToSubstrateWalletOption from "../backToSubstrateWalletOption";
import { useWeb3WalletView } from "next-common/hooks/connect/useWeb3WalletView";

export default function WalletEVMOptions({ selectedWallet, onSelect = noop }) {
  const wallets = useEVMWallets();
  const { setView } = useWeb3WalletView();

  return (
    <div>
      {isMixedChain() && (
        <WalletOptionsWrapper className="mb-6">
          <BackToSubstrateWalletOption
            onClick={() => {
              setView("substrate");
            }}
          />
        </WalletOptionsWrapper>
      )}

      <WalletGroupTitle>EVM Wallet</WalletGroupTitle>

      <WalletOptionsWrapper>
        {wallets.map((wallet, idx) => {
          let icon;
          if (wallet.logo) {
            icon = <wallet.logo className="w-6 h-6" />;
          } else if (wallet.connector?.icon) {
            icon = <img src={wallet.connector?.icon} className="w-6 h-6" />;
          }

          const installed = !!wallet.connector;

          return (
            <WalletOption
              key={wallet.connector?.id || idx}
              installed={installed}
              logo={icon}
              title={wallet.title}
              selected={selectedWallet?.connector?.id === wallet.connector?.id}
              onClick={() => {
                if (!installed) {
                  return;
                }

                onSelect(wallet);
              }}
            />
          );
        })}
      </WalletOptionsWrapper>
    </div>
  );
}
