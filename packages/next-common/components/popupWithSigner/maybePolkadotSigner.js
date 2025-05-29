import MaybeSignerConnected from "./maybeSignerConnected";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { useSubstrateAccounts } from "next-common/hooks/connect/useSubstrateAccounts";
import { find } from "lodash-es";
import { allWallets } from "next-common/utils/consts/connect";
import { usePopupParams } from "./context";

export default function MaybePolkadotSigner({ children }) {
  const { loadingContent = null } = usePopupParams();
  const { lastConnectedAccount } = useConnectedAccountContext();
  const wallet = find(allWallets, {
    extensionName: lastConnectedAccount?.wallet,
  });

  const { accounts, loading } = useSubstrateAccounts({
    wallet,
    defaultLoading: true,
  });

  if (loading) {
    return loadingContent;
  }

  return (
    <MaybeSignerConnected extensionAccounts={accounts}>
      {children}
    </MaybeSignerConnected>
  );
}
