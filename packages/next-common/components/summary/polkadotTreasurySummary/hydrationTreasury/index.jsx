import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next/link";
import { HydrationTreasuryAccount } from "next-common/utils/hydration/consts";
import DotTokenSymbolAsset from "../common/dotTokenSymbolAsset";
import FiatPriceLabel from "../common/fiatPriceLabel";
import { useHydrationTreasurySummary } from "../context/hydrationTreasury";
import TokenSymbolAsset from "../common/tokenSymbolAsset";

export default function TreasuryOnHydration() {
  const { dot, usdt, usdc, isLoading } = useHydrationTreasurySummary();

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
          <FiatPriceLabel free={dot} USDCBalance={usdc} USDtBalance={usdt} />
        </div>
        <div className="flex flex-col gap-y-1 !ml-0">
          <DotTokenSymbolAsset free={dot} />
          <TokenSymbolAsset amount={usdc} symbol="USDC" />
          <TokenSymbolAsset amount={usdt} symbol="USDt" />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
