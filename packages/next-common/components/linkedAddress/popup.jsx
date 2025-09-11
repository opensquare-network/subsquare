import { noop } from "lodash-es";
import Popup from "../popup/wrapper/Popup";
import { useAccount, useConnect } from "wagmi";
import WalletSubstrateSingleSigOptions from "../wallet/options/substrate/singleSig";
import WalletEVMOptions from "../wallet/options/evm";
import { useWeb3WalletView } from "next-common/hooks/connect/useWeb3WalletView";
import { useUnmount } from "react-use";

export default function LinkedAddressSelectWalletPopup({
  selectedWallet,
  onSelect = noop,
  onClose = noop,
}) {
  const { isSubstrateView, isEVMView, resetView } = useWeb3WalletView();
  const { connector } = useAccount();
  const { connect } = useConnect();

  useUnmount(resetView);

  return (
    <Popup className="p-[48px]" onClose={onClose}>
      <h3 className="text20Bold text-textPrimary">
        <span>{"Select "}</span>
        <span className="text-theme500">Wallet</span>
      </h3>

      {isSubstrateView && (
        <WalletSubstrateSingleSigOptions
          selectedWallet={selectedWallet}
          onSelect={onSelect}
        />
      )}

      {isEVMView && (
        <WalletEVMOptions
          selectedWallet={selectedWallet}
          onSelect={(wallet) => {
            function select() {
              onSelect(wallet);
            }

            if (wallet.connector?.id === connector?.id) {
              select();
              return;
            }

            connect(
              { connector: wallet.connector },
              {
                onSuccess() {
                  select();
                },
              },
            );
          }}
        />
      )}
    </Popup>
  );
}
