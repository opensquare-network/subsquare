import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next-common/components/link";
import {
  PolkadotTreasuryOnHydrationAccount1,
  PolkadotTreasuryOnHydrationAccount2,
  PolkadotTreasuryOnHydrationAccount4,
} from "../hook/useQueryHydrationTreasuryBalances";
import NativeTokenSymbolAsset from "../common/nativeTokenSymbolAsset";
import FiatPriceLabel from "../common/fiatPriceLabel";
import { useHydrationTreasurySummary } from "../context/treasuryOnHydration";
import TokenSymbolAsset from "../common/tokenSymbolAsset";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import AddressLinks from "next-common/components/styled/addressLinks";
import Chains from "next-common/utils/consts/chains";
import { getNeckworkBaseUrl } from "next-common/utils/neckwork";

const hydrationExplorerBaseUrl = getNeckworkBaseUrl(Chains.hydradx);

export default function TreasuryOnHydration() {
  const { dot, usdt, usdc, isLoading } = useHydrationTreasurySummary();

  return (
    <SummaryItem
      title={
        <Link
          className="text12Medium"
          href={`${hydrationExplorerBaseUrl}/account/${PolkadotTreasuryOnHydrationAccount2}`}
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
              amount={toPrecision(usdc, SYMBOL_DECIMALS.USDC)}
              symbol="USDC"
            />
            <TokenSymbolAsset
              amount={toPrecision(usdt, SYMBOL_DECIMALS.USDT)}
              symbol="USDT"
            />
            <TreasuryOnHydrationAddressLinks />
          </div>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}

function TreasuryOnHydrationAddressLinks() {
  return (
    <AddressLinks
      items={[
        {
          href: `${hydrationExplorerBaseUrl}/account/${PolkadotTreasuryOnHydrationAccount1}`,
          tooltip: "Treasury stablecoin acquisition #1",
        },
        {
          href: `${hydrationExplorerBaseUrl}/account/${PolkadotTreasuryOnHydrationAccount2}`,
          tooltip: "Treasury stablecoin acquisition #2",
        },
        {
          href: `${hydrationExplorerBaseUrl}/account/${PolkadotTreasuryOnHydrationAccount4}`,
          tooltip: "Treasury stablecoin acquisition #3",
        },
      ]}
    />
  );
}
