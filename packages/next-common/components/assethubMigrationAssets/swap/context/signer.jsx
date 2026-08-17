import { find } from "lodash-es";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { useSubstrateAccounts } from "next-common/hooks/connect/useSubstrateAccounts";
import { allWallets } from "next-common/utils/consts/connect";
import { FeeAssetProvider } from "next-common/components/popupWithSigner/context/feeAsset";
import { SignerContextProvider } from "next-common/components/popupWithSigner/context/signer";
import { GeneralProxiesProvider } from "next-common/context/proxy";

export default function SwapSignerProvider({ children }) {
  const { lastConnectedAccount } = useConnectedAccountContext();
  const wallet = find(allWallets, {
    extensionName: lastConnectedAccount?.wallet,
  });
  const { accounts } = useSubstrateAccounts({ wallet, defaultLoading: true });

  return (
    <FeeAssetProvider>
      <SignerContextProvider extensionAccounts={accounts}>
        <GeneralProxiesProvider>{children}</GeneralProxiesProvider>
      </SignerContextProvider>
    </FeeAssetProvider>
  );
}
