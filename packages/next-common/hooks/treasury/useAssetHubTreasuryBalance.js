import { useAssetHubApi } from "next-common/context/assetHub";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import { useEffect, useState } from "react";

export const StatemintAssets = [
  {
    id: 1984,
    symbol: "USDT",
    decimals: 6,
  },
  {
    id: 1337,
    symbol: "USDC",
    decimals: 6,
  },
];

export const getAssetBySymbol = (symbol) =>
  StatemintAssets.find((asset) => asset.symbol === symbol);

export const StatemintTreasuryAccount =
  "14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk";

export const StatemintFellowShipTreasuryAccount =
  "16VcQSRcMFy6ZHVjBvosKmo7FKqTb8ZATChDYo8ibutzLnos";

export default function useAssetHubTreasuryBalance(symbol) {
  const chain = useChain();

  let treasuryAccount = null;

  if (chain === Chains.polkadot) {
    treasuryAccount = StatemintTreasuryAccount;
  }

  return useAssetHubAssetBalance(treasuryAccount, symbol);
}

export function useAssetHubAssetBalance(account, symbol) {
  const api = useAssetHubApi();

  const [balance, setBalance] = useState(0);
  const [decimals, setDecimals] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api) {
      return;
    }

    if (!account) {
      return;
    }

    setLoading(true);

    const asset = getAssetBySymbol(symbol);
    if (!asset) {
      return;
    }

    setDecimals(asset.decimals);

    api.query.assets.account(asset.id, account).then((data) => {
      const assetInfo = data?.toJSON();
      setBalance(assetInfo?.balance);
      setLoading(false);
    });
  }, [api, account, symbol]);

  return {
    balance,
    decimals,
    loading,
  };
}
