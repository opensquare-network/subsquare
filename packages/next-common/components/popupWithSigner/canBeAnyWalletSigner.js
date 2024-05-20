import { useEffect, useMemo, useState } from "react";
import MaybeSignerConnected from "./maybeSignerConnected";
import ChainTypes from "next-common/utils/consts/chainTypes";
import { useChainSettings } from "next-common/context/chain";
import { normalizeAddress } from "next-common/utils/address";
import WalletTypes from "next-common/utils/consts/walletTypes";
import ContextPopup from "./contextPopup";
import { useSignetAccounts, useSignetSdk } from "next-common/context/signet";
import { useAccounts } from "next-common/hooks/connect/evm/useAccounts";
import { useLastConnector } from "next-common/hooks/connect/evm/useLastConnector";

function usePolkadotAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { chainType } = useChainSettings();

  useEffect(() => {
    (async () => {
      const { web3Enable, web3Accounts } = await import(
        "@polkadot/extension-dapp"
      );

      await web3Enable("subsquare");
      const injectedAccounts = await web3Accounts();

      let filter = (item) => item.type !== "ethereum";
      if (chainType === ChainTypes.ETHEREUM) {
        filter = (item) => item.type === "ethereum";
      } else if (ChainTypes.MIXED === chainType) {
        filter = (item) =>
          item.type !== "ethereum" || item.meta.source === WalletTypes.TALISMAN;
      }

      setAccounts(
        injectedAccounts.filter(filter).map((item) => ({
          ...item,
          address: normalizeAddress(item.address),
        })),
      );
      setIsLoading(false);
    })();
  }, [chainType]);

  return [accounts, isLoading];
}

export default function CanBeAnyWalletSigner({ children }) {
  const lastConnector = useLastConnector();
  const evmAccounts = useAccounts({ connector: lastConnector });
  const [polkadotAccounts, isLoadingPolkadot] = usePolkadotAccounts(true);
  const signetAccounts = useSignetAccounts();
  const { loading: isLoadingSignet } = useSignetSdk();

  const combinedAccounts = useMemo(
    () => [...evmAccounts, ...polkadotAccounts, ...signetAccounts],
    [evmAccounts, polkadotAccounts, signetAccounts],
  );

  if (isLoadingPolkadot || isLoadingSignet) {
    return null;
  }

  return (
    <MaybeSignerConnected extensionAccounts={combinedAccounts}>
      <ContextPopup>{children}</ContextPopup>
    </MaybeSignerConnected>
  );
}
