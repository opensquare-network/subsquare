import { noop } from "lodash-es";
import MimirWallet from "next-common/components/wallet/mimirWallet";
import { useSubstrateWallets } from "next-common/hooks/connect/useSubstrateWallets";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { WalletOptionsWrapper } from "../styled";

export default function WalletSubstrateMultiSigOptions({
  selectedWallet,
  onSelect = noop,
}) {
  const { multiSigWallets } = useSubstrateWallets();

  if (!multiSigWallets?.length) {
    return null;
  }

  return (
    <WalletOptionsWrapper>
      {(multiSigWallets || []).map((wallet) => {
        const selected = wallet.extensionName === selectedWallet?.extensionName;

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
