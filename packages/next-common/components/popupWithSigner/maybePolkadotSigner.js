import MaybeSignerConnected from "./maybeSignerConnected";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { useSubstrateAccounts } from "next-common/hooks/connect/useSubstrateAccounts";
import { find } from "lodash-es";
import { allWallets } from "next-common/utils/consts/connect";

export default function MaybePolkadotSigner({ children }) {
  const { lastConnectedAccount } = useConnectedAccountContext();
  const wallet = find(allWallets, {
    extensionName: lastConnectedAccount?.wallet,
  });

  const { accounts, loading } = useSubstrateAccounts({
    wallet,
    defaultLoading: true,
  });

  if (loading) {
    return null;
  }

  return (
    <MaybeSignerConnected extensionAccounts={accounts}>
      {children}
    </MaybeSignerConnected>
  );
}
