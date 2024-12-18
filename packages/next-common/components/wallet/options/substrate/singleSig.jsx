import { ArrowRight, NetworkEthereumLight } from "@osn/icons/subsquare";
import { noop } from "lodash-es";
import { NovaWallet } from "next-common/components/wallet/novaWallet";
import PolkagateSnapWallet from "next-common/components/wallet/polkagateSnapWallet";
import SubstrateWallet from "next-common/components/wallet/substrateWallet";
import { useSubstrateWallets } from "next-common/hooks/connect/useSubstrateWallets";
import { useWeb3WalletView } from "next-common/hooks/connect/useWeb3WalletView";
import WalletTypes from "next-common/utils/consts/walletTypes";
import isMixedChain from "next-common/utils/isMixedChain";
import WalletOption from "../../walletOption";
import { WalletOptionsWrapper } from "../styled";
import isEvmChain, {
  isSupportSubstrateThroughEthereumAddress,
} from "next-common/utils/isEvmChain";

export default function WalletSubstrateSingleSigOptions({
  selectedWallet,
  onSelect = noop,
}) {
  const { singleSigWallets } = useSubstrateWallets();
  const { setView } = useWeb3WalletView();

  if (!singleSigWallets?.length) {
    return null;
  }

  const enableSubstrate =
    isMixedChain() ||
    (isEvmChain() && isSupportSubstrateThroughEthereumAddress());

  return (
    <WalletOptionsWrapper>
      {(singleSigWallets || []).map((wallet) => {
        const selected = wallet.extensionName === selectedWallet?.extensionName;

        if (wallet.extensionName === WalletTypes.NOVA) {
          return (
            <NovaWallet
              key={wallet.extensionName}
              wallet={wallet}
              onClick={() => {
                onSelect(wallet);
              }}
              selected={selected}
            />
          );
        }

        if (wallet.extensionName === WalletTypes.POLKAGATE_SNAP) {
          return (
            <PolkagateSnapWallet
              key={wallet.extensionName}
              wallet={wallet}
              onClick={() => {
                onSelect(wallet);
              }}
              selected={selected}
            />
          );
        }

        return (
          <SubstrateWallet
            key={wallet.extensionName}
            wallet={wallet}
            onClick={() => {
              onSelect(wallet);
            }}
            selected={selected}
          />
        );
      })}

      {enableSubstrate && (
        <WalletOption
          installed
          logo={<NetworkEthereumLight />}
          title="EVM"
          iconRight={<ArrowRight className="w-5 h-5 text-textTertiary" />}
          onClick={() => {
            setView("evm");
          }}
        />
      )}
    </WalletOptionsWrapper>
  );
}
