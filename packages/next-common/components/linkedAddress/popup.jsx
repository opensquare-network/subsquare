import { noop } from "lodash-es";
import Popup from "../popup/wrapper/Popup";
import { useConnection, useConnect, useConnectors } from "wagmi";
import WalletSubstrateSingleSigOptions from "../wallet/options/substrate/singleSig";
import WalletEVMOptions from "../wallet/options/evm";
import { useWeb3WalletView } from "next-common/hooks/connect/useWeb3WalletView";
import { useUnmount } from "react-use";
import useEVMWalletConnect from "next-common/hooks/connect/useEVMWalletConnect";
import { WalletConnectQrCode } from "../login/web3/walletconnect";

export default function LinkedAddressSelectWalletPopup({
  selectedWallet,
  onSelect = noop,
  onClose = noop,
}) {
  const { isSubstrateView, isEVMView, resetView } = useWeb3WalletView();
  const { connector } = useConnection();
  const { mutate } = useConnect();
  const connectors = useConnectors();
  const walletConnect = useEVMWalletConnect(
    connectors.find((item) => item.id === "walletConnect"),
  );

  useUnmount(resetView);

  async function handleSelectWallet(wallet) {
    if (wallet.connector?.id === connector?.id) {
      onSelect(wallet);
      return;
    }

    if (wallet.connector.id === "walletConnect") {
      if (await walletConnect.open()) {
        onSelect(wallet);
      }
      return;
    }

    mutate(
      { connector: wallet.connector },
      {
        onSuccess() {
          onSelect(wallet);
        },
      },
    );
  }

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

      {isEVMView && walletConnect.isOpen && (
        <WalletConnectQrCode
          uri={walletConnect.uri}
          backTitle="Back to EVM"
          onBack={walletConnect.close}
        />
      )}

      {isEVMView && !walletConnect.isOpen && (
        <WalletEVMOptions
          selectedWallet={selectedWallet}
          onSelect={handleSelectWallet}
        />
      )}
    </Popup>
  );
}
