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

function useAssetBalance(asset) {
  return {
    ...asset,
    balance: useSubscribeAssetHubAssets(asset.id, StatemintTreasuryAccount)
      .free,
  };
}

const getAssetBySymbol = (symbol) =>
  StatemintAssets.find((asset) => asset.symbol === symbol);

export default function MultiAssetsTreasury() {
  const { setMultiAssetsFree, setUSDtBalance, setUSDCBalance } =
    usePolkadotTreasurySummary();

  const { free, isLoading } = useSubscribeFellowshipTreasuryFree(
    StatemintTreasuryAccount,
  );

  const usdtAsset = getAssetBySymbol("USDt");
  const usdcAsset = getAssetBySymbol("USDC");

  const usdtBalance = useAssetBalance(usdtAsset)?.balance;
  const usdcBalance = useAssetBalance(usdcAsset)?.balance;

  useEffect(() => {
    if (usdtBalance !== undefined) {
      setUSDtBalance(usdtBalance);
    }

    if (usdcBalance !== undefined) {
      setUSDCBalance(usdcBalance);
    }
  }, [usdtBalance, usdcBalance, setUSDtBalance, setUSDCBalance]);

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
          <span className="text-textTertiary hover:underline">Asset Hub</span>
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
          <TokenSymbolAsset amount={usdcBalance} symbol={usdcAsset.symbol} />
          <TokenSymbolAsset amount={usdtBalance} symbol={usdtAsset.symbol} />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
