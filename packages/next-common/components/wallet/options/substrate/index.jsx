import { useSubstrateWallets } from "next-common/hooks/connect/useSubstrateWallets";
import { WalletGroupTitle } from "../styled";
import WalletSubstrateSingleSigOptions from "./singleSig";
import WalletSubstrateMultiSigOptions from "./multiSig";
import { noop } from "lodash-es";

export default function WalletSubstrateOptions({
  selectedWallet,
  onSelect = noop,
}) {
  const { singleSigWallets, multiSigWallets } = useSubstrateWallets();

  return (
    <>
      {!!singleSigWallets?.length && (
        <div>
          <WalletGroupTitle>SingleSig Wallets</WalletGroupTitle>
          <WalletSubstrateSingleSigOptions
            selectedWallet={selectedWallet}
            onSelect={onSelect}
          />
        </div>
      )}

      {!!multiSigWallets?.length && (
        <div>
          <WalletGroupTitle>MultiSig Wallets</WalletGroupTitle>
          <WalletSubstrateMultiSigOptions
            selectedWallet={selectedWallet}
            onSelect={onSelect}
          />
        </div>
      )}
    </>
  );
}
