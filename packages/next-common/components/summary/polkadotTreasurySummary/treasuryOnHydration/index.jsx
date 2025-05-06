import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next/link";
import {
  PolkadotTreasuryOnHydrationAccount1,
  PolkadotTreasuryOnHydrationAccount2,
  PolkadotTreasuryOnHydrationAccount3,
  PolkadotTreasuryOnHydrationAccount4,
} from "../hook/useQueryHydrationTreasuryBalances";
import NativeTokenSymbolAsset from "../common/nativeTokenSymbolAsset";
import FiatPriceLabel from "../common/fiatPriceLabel";
import { useHydrationTreasurySummary } from "../context/treasuryOnHydration";
import TokenSymbolAsset from "../common/tokenSymbolAsset";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import Tooltip from "next-common/components/tooltip";

function AddressLink({ account, index }) {
  return (
    <Link
      className="text12Medium"
      href={`https://hydration.subscan.io/account/${account}`}
      target="_blank"
      rel="noreferrer"
    >
      <Tooltip
        content={`Treasury stablecoin acquisition #${index}`}
        className="flex flex-nowrap whitespace-nowrap"
      >
        <span className="text-textTertiary hover:underline">Addr #{index}</span>
        <i className="text-textTertiary">&nbsp;↗</i>
      </Tooltip>
    </Link>
  );
}

function AddressLinks() {
  return (
    <div className="gap-x-1 grid grid-cols-2">
      <AddressLink account={PolkadotTreasuryOnHydrationAccount1} index={1} />
      <AddressLink account={PolkadotTreasuryOnHydrationAccount2} index={2} />
      <AddressLink account={PolkadotTreasuryOnHydrationAccount3} index={3} />
      <AddressLink account={PolkadotTreasuryOnHydrationAccount4} index={4} />
    </div>
  );
}

export default function TreasuryOnHydration() {
  const { dot, usdt, usdc, isLoading } = useHydrationTreasurySummary();

  return (
    <SummaryItem
      title={
        <Link
          className="text12Medium"
          href={`https://hydration.subscan.io/account/${PolkadotTreasuryOnHydrationAccount2}`}
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
            <NativeTokenSymbolAsset free={dot} />
            <TokenSymbolAsset
              amount={toPrecision(usdt, SYMBOL_DECIMALS.USDT)}
              symbol="USDC"
            />
            <TokenSymbolAsset
              amount={toPrecision(usdc, SYMBOL_DECIMALS.USDC)}
              symbol="USDT"
            />
            <AddressLinks />
          </div>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
