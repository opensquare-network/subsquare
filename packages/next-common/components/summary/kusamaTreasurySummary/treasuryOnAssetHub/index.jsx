import LoadableContent from "next-common/components/common/loadableContent";
import Link from "next/link";
import NativeTokenSymbolAsset from "next-common/components/summary/polkadotTreasurySummary/common/nativeTokenSymbolAsset";
import FiatPriceLabel from "../common/fiatPriceLabel";
import SummaryItem from "next-common/components/summary/layout/item";
import { KusamaAssetHubAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { useKusamaTreasuryContext } from "next-common/context/treasury/kusamaTreasury";

function TreasurySummary({ free }) {
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="!ml-0 flex flex-col gap-y-1">
        <NativeTokenSymbolAsset free={free} />
      </div>
    </div>
  );
}

export default function TreasuryOnAssetHub() {
  const {
    nativeTreasuryBalanceOnAssetHub,
    isNativeTreasuryBalanceOnAssetHubLoading,
  } = useKusamaTreasuryContext();

  return (
    <SummaryItem
      title={
        <Link
          className="text12Medium"
          href={`https://assethub-kusama.subscan.io/account/${KusamaAssetHubAccount}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-textTertiary hover:underline">Asset Hub</span>
          <i className="text-textTertiary">&nbsp;↗</i>
        </Link>
      }
    >
      <LoadableContent isLoading={isNativeTreasuryBalanceOnAssetHubLoading}>
        <div className="flex flex-col gap-[4px]">
          <FiatPriceLabel free={nativeTreasuryBalanceOnAssetHub} />
          <TreasurySummary free={nativeTreasuryBalanceOnAssetHub} />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
