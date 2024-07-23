import { noop } from "lodash-es";
import MimirWallet from "next-common/components/wallet/mimirWallet";
import { SignetWallet } from "next-common/components/wallet/signetWallet";
import { useSubstrateWallets } from "next-common/hooks/connect/useSubstrateWallets";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { WalletOptionsWrapper } from "../styled";

export default function WalletSubstrateMultiSigOptions({
  selectedWallet,
  onSelect = noop,
}) {
  const { multisigWallets } = useSubstrateWallets();

  if (!multisigWallets?.length) {
    return null;
  }

  return (
    <WalletOptionsWrapper>
      {(multisigWallets || []).map((wallet) => {
        const selected = wallet.extensionName === selectedWallet?.extensionName;

        if (wallet.extensionName === WalletTypes.SIGNET) {
          return (
            <SignetWallet
              key={wallet.extensionName}
              wallet={wallet}
              onClick={() => {
                onSelect(wallet);
              }}
              selected={selected}
            />
          );
        }

        if (wallet.extensionName === WalletTypes.MIMIR) {
          return (
            <MimirWallet
              key={wallet.extensionName}
              wallet={wallet}
              onClick={() => {
                onSelect(wallet);
              }}
              selected={selected}
            />
          );
        }

        return null;
      })}
    </WalletOptionsWrapper>
  );
}
