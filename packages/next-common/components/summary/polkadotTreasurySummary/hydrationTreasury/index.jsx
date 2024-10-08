import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next/link";
import { HydrationTreasuryAccount } from "next-common/hooks/treasury/useHydrationTreasuryBalance";
import DotTokenSymbolAsset from "../common/dotTokenSymbolAsset";
import FiatPriceLabel from "../common/fiatPriceLabel";
import { useHydrationTreasurySummary } from "../context/hydrationTreasury";
import TokenSymbolAsset from "../common/tokenSymbolAsset";
import { toPrecisionNumber } from "next-common/utils";

export default function HydrationTreasury() {
  const { dot, usdt, usdc, isDotLoading, isTokensLoading } =
    useHydrationTreasurySummary();

  const usdtAmount = toPrecisionNumber(usdt, 6);
  const usdcAmount = toPrecisionNumber(usdc, 6);

  const isLoading = isDotLoading || isTokensLoading;

  return (
    <SummaryItem
      title={
        <Link
          className="text12Medium"
          href={`https://hydration.subscan.io/account/${HydrationTreasuryAccount}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-textTertiary hover:underline">Hydration</span>
          <i className="text-textTertiary">&nbsp;↗</i>
        </Link>
      }
    >
      <LoadableContent isLoading={isLoading}>
        <div>
          <FiatPriceLabel
            free={dot}
            USDCBalance={usdcAmount}
            USDtBalance={usdtAmount}
          />
        </div>
        <div className="flex flex-col gap-y-1 !ml-0">
          <DotTokenSymbolAsset free={dot} />
          <TokenSymbolAsset amount={usdcAmount} symbol="USDC" />
          <TokenSymbolAsset amount={usdtAmount} symbol="USDt" />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
