import BigNumber from "bignumber.js";
import { useAssetHubApi } from "next-common/context/assetHub";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import { useEffect, useState } from "react";

export const StatemintAssets = [
  {
    id: 1984,
    symbol: "USDt",
    decimals: 6,
  },
  {
    id: 1337,
    symbol: "USDC",
    decimals: 6,
  },
];

const StatemintTreasuryAccount =
  "14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk";

export default function useAssetHubTreasuryBalance(symbol) {
  const api = useAssetHubApi();

  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const chain = useChain();

  let treasuryAccount = null;

  if (chain === Chains.polkadot) {
    treasuryAccount = StatemintTreasuryAccount;
  }

  useEffect(() => {
    if (!api) {
      return;
    }

    if (!treasuryAccount) {
      return;
    }

    const asset = StatemintAssets.find((asset) => asset.symbol === symbol);
    if (!asset) {
      return;
    }

    setLoading(true);
    api.query.assets.account(asset.id, treasuryAccount).then((data) => {
      const assetInfo = data?.toJSON();
      setBalance(
        new BigNumber(assetInfo.balance.toString())
          .div(Math.pow(10, asset.decimals))
          .toFixed(),
      );

      setLoading(false);
    });
  }, [api, treasuryAccount, symbol]);

  return {
    balance,
    loading,
  };
}
