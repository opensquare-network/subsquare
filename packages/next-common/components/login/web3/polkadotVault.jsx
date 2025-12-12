import { ArrowCircleLeft } from "@osn/icons/subsquare";
import {
  WalletGroupTitle,
  WalletOptionsWrapper,
} from "next-common/components/wallet/options/styled";
import WalletOption from "next-common/components/wallet/walletOption";
import { useWeb3WalletView } from "next-common/hooks/connect/useWeb3WalletView";
import Scan from "next-common/components/polkadotVault/scan";
import ScanResult from "next-common/components/polkadotVault/scanResult";

export default function LoginWeb3PolkadotVault() {
  const { setView } = useWeb3WalletView();

  return (
    <div className="pb-2">
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

      <WalletGroupTitle>Scan Your Vault QR Code</WalletGroupTitle>

      <div className="flex justify-center">
        <div className="w-full">
          <Scan />
          <ScanResult />
        </div>
      </div>
    </div>
  );
}
