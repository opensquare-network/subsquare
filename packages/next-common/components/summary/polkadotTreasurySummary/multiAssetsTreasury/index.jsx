import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next/link";
import TokenSymbolAsset from "../common/tokenSymbolAsset";
import {
  StatemintTreasuryAccount,
  StatemintAssets,
} from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import DotTokenSymbolAsset from "../common/dotTokenSymbolAsset";
import { useSubscribeFellowshipTreasuryFree } from "../hook/useSubscribeAssetHubTreasuryFree";
import FiatPriceLabel from "../common/fiatPriceLabel";
import { useSubscribeAssetHubAssets } from "../hook/useSubscribeAssetHubAssets";
import { useEffect } from "react";
import { usePolkadotTreasurySummary } from "../context";

function useSingleAssetBalance(asset) {
  return {
    ...asset,
    balance: useSubscribeAssetHubAssets(asset.id, StatemintTreasuryAccount)
      .free,
  };
}

export default function MultiAssetsTreasury() {
  const { setMultiAssetsFree, setUSDtBalance, setUSDCBalance } =
    usePolkadotTreasurySummary();

  const { free, isLoading } = useSubscribeFellowshipTreasuryFree(
    StatemintTreasuryAccount,
  );

  const assetBalances = StatemintAssets.map((asset) => {
    const assetBalance = useSingleAssetBalance(asset);
    return assetBalance;
  });
  const usdtBalance = assetBalances.find(
    (asset) => asset.symbol === "USDt",
  )?.balance;
  const usdcBalance = assetBalances.find(
    (asset) => asset.symbol === "USDC",
  )?.balance;

  useEffect(() => {
    if (usdtBalance !== undefined) {
      setUSDtBalance(usdtBalance);
    }

    if (usdcBalance !== undefined) {
      setUSDCBalance(usdcBalance);
    }
  }, [assetBalances, usdtBalance, usdcBalance, setUSDtBalance, setUSDCBalance]);

  useEffect(() => {
    if (free) {
      setMultiAssetsFree(free);
    }
  }, [free, setMultiAssetsFree]);

  return (
    <SummaryItem
      title={
        <Link
          className="text12Medium"
          href={`https://statemint.statescan.io/#/accounts/${StatemintTreasuryAccount}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-textTertiary hover:underline">
            Multi Assets Treasury
          </span>
          <i className="text-textTertiary">&nbsp;↗</i>
        </Link>
      }
    >
      <LoadableContent isLoading={isLoading}>
        <div>
          <FiatPriceLabel
            free={free}
            USDCBalance={usdcBalance}
            USDtBalance={usdtBalance}
          />
        </div>
        <div className="!ml-0 flex flex-col gap-y-1">
          <DotTokenSymbolAsset free={free} />
          {assetBalances.map((item) => (
            <TokenSymbolAsset
              amount={item.balance || 0}
              symbol={item.symbol}
              key={item.symbol}
            />
          ))}
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
