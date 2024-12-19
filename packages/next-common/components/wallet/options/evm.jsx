import { noop } from "lodash-es";
import WalletOption from "next-common/components/wallet/walletOption";
import { WalletGroupTitle, WalletOptionsWrapper } from "./styled";
import { useEVMWallets } from "next-common/hooks/connect/useEVMWallets";
import { useWeb3WalletView } from "next-common/hooks/connect/useWeb3WalletView";
import { ArrowCircleLeft } from "@osn/icons/subsquare";
import isShouldEnableSubstrateWallets from "next-common/utils/isShouldEnableSubstrateWallets";

export default function WalletEVMOptions({ selectedWallet, onSelect = noop }) {
  const wallets = useEVMWallets();
  const { setView } = useWeb3WalletView();

  const enableSubstrate = isShouldEnableSubstrateWallets();

  return (
    <div>
      {enableSubstrate && (
        <WalletOptionsWrapper className="mb-6">
          <WalletOption
            installed
            logo={<ArrowCircleLeft className="text-textSecondary" />}
            title="Back to Substrate"
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
