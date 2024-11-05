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
  const {
    dotTreasuryBalanceOnRelayChain,
    isDotTreasuryBalanceOnRelayChainLoading,
    dotTreasuryBalanceOnAssetHub,
    isDotTreasuryBalanceOnAssetHubLoading,
    fellowshipTreasuryDotBalance,
    isFellowshipTreasuryDotBalanceLoading,
    usdtTreasuryBalanceOnAssetHub,
    isUsdtTreasuryBalanceOnAssetHubLoading,
    usdcTreasuryBalanceOnAssetHub,
    isUsdcTreasuryBalanceOnAssetHubLoading,
    fellowshipSalaryUsdtBalance,
    isFellowshipSalaryUsdtBalanceLoading,
    loanCentrifugeUsdcBalance,
    loanBifrostDotBalance,
    loadPendulumDotBalance,
    dotTreasuryBalanceOnBounties,
    isDotTreasuryBalanceOnBountiesLoading,
  } = usePolkadotTreasurySummary();

  const {
    dot: hydrationTreasuryDot,
    usdt: hydrationTreasuryUsdt,
    usdc: hydrationTreasuryUsdc,
    isLoading: isHydrationTreasuryLoading,
  } = useHydrationTreasurySummary();

  const isTotalAssetsLoading =
    isDotTreasuryBalanceOnRelayChainLoading ||
    isDotTreasuryBalanceOnAssetHubLoading ||
    isUsdtTreasuryBalanceOnAssetHubLoading ||
    isUsdcTreasuryBalanceOnAssetHubLoading ||
    isFellowshipTreasuryDotBalanceLoading ||
    isFellowshipSalaryUsdtBalanceLoading ||
    isHydrationTreasuryLoading ||
    isDotTreasuryBalanceOnBountiesLoading;

  const totalDotBalance = new BigNumber(dotTreasuryBalanceOnRelayChain || 0)
    .plus(dotTreasuryBalanceOnAssetHub || 0)
    .plus(fellowshipTreasuryDotBalance || 0)
    .plus(hydrationTreasuryDot || 0)
    .plus(loanBifrostDotBalance || 0)
    .plus(loadPendulumDotBalance || 0)
    .plus(dotTreasuryBalanceOnBounties || 0)
    .toString();

  const totalUsdtBalance = new BigNumber(usdtTreasuryBalanceOnAssetHub || 0)
    .plus(hydrationTreasuryUsdt || 0)
    .plus(fellowshipSalaryUsdtBalance || 0)
    .toString();

  const totalUsdcBalance = new BigNumber(usdcTreasuryBalanceOnAssetHub || 0)
    .plus(hydrationTreasuryUsdc || 0)
    .plus(loanCentrifugeUsdcBalance || 0)
    .toString();

  return (
    <SummaryItem title="Total">
      <LoadableContent isLoading={isTotalAssetsLoading}>
        <div className="flex flex-col gap-[4px]">
          <FiatPriceLabel
            free={totalDotBalance}
            usdtBalance={totalUsdtBalance}
            usdcBalance={totalUsdcBalance}
          />
          <div className="!ml-0 flex flex-col gap-y-1">
            <DotTokenSymbolAsset free={totalDotBalance} />
            <TokenSymbolAsset
              type={""}
              amount={toPrecision(totalUsdcBalance, SYMBOL_DECIMALS.USDC)}
              symbol={"USDC"}
            />
            <TokenSymbolAsset
              type={""}
              amount={toPrecision(totalUsdtBalance, SYMBOL_DECIMALS.USDT)}
              symbol={"USDt"}
            />
          </div>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
