import SummaryItem from "next-common/components/summary/layout/item";
import FiatPriceLabel from "../common/fiatPriceLabel";
import NativeTokenSymbolAsset from "next-common/components/summary/polkadotTreasurySummary/common/nativeTokenSymbolAsset";
import LoadableContent from "next-common/components/common/loadableContent";
import BigNumber from "bignumber.js";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import { useKusamaTreasuryContext } from "next-common/context/treasury/kusamaTreasury";

function TokenWrappper({ children }) {
  return (
    <div className="bg-neutral200 py-1 px-2 rounded-[4px]">{children}</div>
  );
}

export default function TotalTreasury() {
  const [navCollapsed] = useNavCollapsed();

  const {
    nativeTreasuryBalanceOnRelayChain,
    isNativeTreasuryBalanceOnRelayChainLoading,
    nativeTreasuryBalanceOnAssetHub,
    isNativeTreasuryBalanceOnAssetHubLoading,
    loansHydrationNativeBalance,
  } = useKusamaTreasuryContext();

  const isTotalAssetsLoading =
    isNativeTreasuryBalanceOnRelayChainLoading ||
    isNativeTreasuryBalanceOnAssetHubLoading;

  const totalNativeBalance = new BigNumber(
    nativeTreasuryBalanceOnRelayChain || 0,
  )
    .plus(nativeTreasuryBalanceOnAssetHub || 0)
    .plus(loansHydrationNativeBalance)
    .toString();

  return (
    <SummaryItem title="Total">
      <LoadableContent isLoading={isTotalAssetsLoading}>
        <div className="flex flex-col gap-2">
          <FiatPriceLabel free={totalNativeBalance} />
          <div
            className={cn(
              "!ml-0 grid gap-2 grid-cols-4",
              !navCollapsed ? "max-md:grid-cols-2" : "max-sm:grid-cols-2",
            )}
          >
            <TokenWrappper>
              <NativeTokenSymbolAsset
                free={totalNativeBalance}
                valueClassName={"text-textSecondary"}
              />
            </TokenWrappper>
          </div>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
