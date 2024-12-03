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
import { MythTokenAsset } from "../mythToken";
import { useMythTokenAssets } from "../context/mythTokenAssets";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";

function TokenWrappper({ children }) {
  return (
    <div className="bg-neutral200 py-1 px-2 rounded-[4px]">{children}</div>
  );
}

export default function TotalTreasury() {
  const [navCollapsed] = useNavCollapsed();

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
    loanHydrationDotBalance,
    dotTreasuryBalanceOnBounties,
    isDotTreasuryBalanceOnBountiesLoading,
  } = usePolkadotTreasurySummary();

  const {
    dot: hydrationTreasuryDot,
    usdt: hydrationTreasuryUsdt,
    usdc: hydrationTreasuryUsdc,
    isLoading: isHydrationTreasuryLoading,
  } = useHydrationTreasurySummary();

  const { isLoading: isMythTokenBalanceLoading, mythTokenBalance } =
    useMythTokenAssets();

  const isTotalAssetsLoading =
    isDotTreasuryBalanceOnRelayChainLoading ||
    isDotTreasuryBalanceOnAssetHubLoading ||
    isUsdtTreasuryBalanceOnAssetHubLoading ||
    isUsdcTreasuryBalanceOnAssetHubLoading ||
    isFellowshipTreasuryDotBalanceLoading ||
    isFellowshipSalaryUsdtBalanceLoading ||
    isHydrationTreasuryLoading ||
    isDotTreasuryBalanceOnBountiesLoading ||
    isMythTokenBalanceLoading;

  const totalDotBalance = new BigNumber(dotTreasuryBalanceOnRelayChain || 0)
    .plus(dotTreasuryBalanceOnAssetHub || 0)
    .plus(fellowshipTreasuryDotBalance || 0)
    .plus(hydrationTreasuryDot || 0)
    .plus(loanBifrostDotBalance || 0)
    .plus(loadPendulumDotBalance || 0)
    .plus(loanHydrationDotBalance || 0)
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
        <div className="flex flex-col gap-2">
          <FiatPriceLabel
            free={totalDotBalance}
            usdtBalance={totalUsdtBalance}
            usdcBalance={totalUsdcBalance}
            mythTokenBalance={mythTokenBalance}
          />
          <div
            className={cn(
              "!ml-0 grid gap-2 grid-cols-4",
              !navCollapsed ? "max-md:grid-cols-2" : "max-sm:grid-cols-2",
            )}
          >
            <TokenWrappper>
              <DotTokenSymbolAsset
                free={totalDotBalance}
                valueClassName={"text-textSecondary"}
              />
            </TokenWrappper>

            <TokenWrappper>
              <TokenSymbolAsset
                type={""}
                amount={toPrecision(totalUsdcBalance, SYMBOL_DECIMALS.USDC)}
                symbol={"USDC"}
                valueClassName={"text-textSecondary"}
              />
            </TokenWrappper>

            <TokenWrappper>
              <TokenSymbolAsset
                type={""}
                amount={toPrecision(totalUsdtBalance, SYMBOL_DECIMALS.USDT)}
                symbol={"USDt"}
                valueClassName={"text-textSecondary"}
              />
            </TokenWrappper>
            <TokenWrappper>
              <MythTokenAsset
                balance={mythTokenBalance}
                className={"text-textSecondary"}
              />
            </TokenWrappper>
          </div>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
