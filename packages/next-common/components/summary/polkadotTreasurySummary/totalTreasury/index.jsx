import SummaryItem from "next-common/components/summary/layout/item";
import TokenSymbolAsset from "../common/tokenSymbolAsset";
import FiatPriceLabel from "../common/fiatPriceLabel";
import DotTokenSymbolAsset from "../common/dotTokenSymbolAsset";
import LoadableContent from "next-common/components/common/loadableContent";
import { usePolkadotTreasurySummary } from "../context";
import { useHydrationTreasurySummary } from "../context/treasuryOnHydration";
import BigNumber from "bignumber.js";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";

export default function TotalTreasury() {
  const { DOTBalance, USDtBalance, USDCBalance, isTotalAssetsLoading } =
    usePolkadotTreasurySummary();

  const {
    dot: hydrationTreasuryDot,
    usdt: hydrationTreasuryUsdt,
    usdc: hydrationTreasuryUsdc,
    isLoading: isHydrationTreasuryLoading,
  } = useHydrationTreasurySummary();

  const totalDotBalance = new BigNumber(DOTBalance)
    .plus(hydrationTreasuryDot)
    .toString();
  const totalUsdtBalance = new BigNumber(USDtBalance)
    .plus(toPrecision(hydrationTreasuryUsdt, SYMBOL_DECIMALS.USDT))
    .toString();
  const totalUsdcBalance = new BigNumber(USDCBalance)
    .plus(toPrecision(hydrationTreasuryUsdc, SYMBOL_DECIMALS.USDC))
    .toString();

  return (
    <SummaryItem title="Total">
      <LoadableContent
        isLoading={isTotalAssetsLoading || isHydrationTreasuryLoading}
      >
        <div className="flex flex-col gap-[4px]">
          <FiatPriceLabel
            free={totalDotBalance}
            USDtBalance={totalUsdtBalance}
            USDCBalance={totalUsdcBalance}
          />
          <div className="!ml-0 flex flex-col gap-y-1">
            <DotTokenSymbolAsset free={totalDotBalance} />
            <TokenSymbolAsset
              type={""}
              amount={totalUsdcBalance}
              symbol={"USDC"}
            />
            <TokenSymbolAsset
              type={""}
              amount={totalUsdtBalance}
              symbol={"USDt"}
            />
          </div>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
