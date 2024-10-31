import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next/link";
import { PolkadotTreasuryOnHydrationAccount } from "../hook/useSubscribeHydrationTreasuryBalances";
import DotTokenSymbolAsset from "../common/dotTokenSymbolAsset";
import FiatPriceLabel from "../common/fiatPriceLabel";
import { useHydrationTreasurySummary } from "../context/treasuryOnHydration";
import TokenSymbolAsset from "../common/tokenSymbolAsset";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";

export default function TreasuryOnHydration() {
  const { dot, usdt, usdc, isLoading } = useHydrationTreasurySummary();

  return (
    <SummaryItem
      title={
        <Link
          className="text12Medium"
          href={`https://hydration.subscan.io/account/${PolkadotTreasuryOnHydrationAccount}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-textTertiary hover:underline">Hydration</span>
          <i className="text-textTertiary">&nbsp;↗</i>
        </Link>
      }
    >
      <LoadableContent isLoading={isLoading}>
        <div className="flex flex-col gap-[4px]">
          <div>
            <FiatPriceLabel free={dot} usdcBalance={usdc} usdtBalance={usdt} />
          </div>
          <div className="flex flex-col gap-y-1 !ml-0">
            <DotTokenSymbolAsset free={dot} />
            <TokenSymbolAsset
              amount={toPrecision(usdt, SYMBOL_DECIMALS.USDT)}
              symbol="USDC"
            />
            <TokenSymbolAsset
              amount={toPrecision(usdc, SYMBOL_DECIMALS.USDC)}
              symbol="USDt"
            />
          </div>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
