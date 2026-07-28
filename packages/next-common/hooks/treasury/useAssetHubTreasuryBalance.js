import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import { useEffect, useState } from "react";

export const StatemintAssets = [
  {
    type: "asset",
    id: 1984,
    symbol: "USDT",
    decimals: 6,
  },
  {
    type: "asset",
    id: 1337,
    symbol: "USDC",
    decimals: 6,
  },
  {
    type: "foreignAsset",
    id: 222,
    symbol: "HOLLAR",
    decimals: 18,
    multiLocation: {
      parents: 1,
      interior: {
        X2: [{ Parachain: 2034 }, { GeneralIndex: 222 }],
      },
    },
  },
];

export const getAssetBySymbol = (symbol) =>
  StatemintAssets.find((asset) => asset.symbol === symbol);

export const StatemintTreasuryAccount =
  "14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk";

export const StatemintFellowShipTreasuryAccount =
  "16VcQSRcMFy6ZHVjBvosKmo7FKqTb8ZATChDYo8ibutzLnos";

export const KusamaAssetHubAccount =
  "HWZmQq6zMMk7TxixHfseFT2ewicT6UofPa68VCn3gkXrdJF";

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

    if (asset.type === "foreignAsset") {
      api.query.foreignAssets
        .account(asset.multiLocation, account)
        .then((data) => {
          const assetInfo = data?.toJSON();
          setBalance(assetInfo?.balance || 0);
          setLoading(false);
        })
        .catch(() => {
          setBalance(0);
          setLoading(false);
        });
      return;
    }

    api.query.assets.account(asset.id, account).then((data) => {
      const assetInfo = data?.toJSON();
      setBalance(assetInfo?.balance || 0);
      setLoading(false);
    });
  }, [api, account, symbol]);

  return {
    balance,
    decimals,
    loading,
  };
}
