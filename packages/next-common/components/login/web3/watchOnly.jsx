import { ArrowCircleLeft } from "@osn/icons/subsquare";
import {
  WalletGroupTitle,
  WalletOptionsWrapper,
} from "next-common/components/wallet/options/styled";
import WalletOption from "next-common/components/wallet/walletOption";
import { useWeb3WalletView } from "next-common/hooks/connect/useWeb3WalletView";
import WatchOnlyAddressForm from "next-common/components/watchOnly/addressForm";

export default function LoginWeb3WatchOnly() {
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

      <WalletGroupTitle>Watch-only Address</WalletGroupTitle>

      <WatchOnlyAddressForm />
    </div>
  );
}
