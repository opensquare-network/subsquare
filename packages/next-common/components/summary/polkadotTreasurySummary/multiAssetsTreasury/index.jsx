import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next/link";
import TokenSymbolAsset from "../common/tokenSymbolAsset";
import { StatemintTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import DotTokenSymbolAsset from "../common/dotTokenSymbolAsset";
import FiatPriceLabel from "../common/fiatPriceLabel";
import { usePolkadotTreasurySummary } from "../context";

export default function MultiAssetsTreasury() {
  const { multiAssetsFree, USDtBalance, USDCBalance, isMultiAssetsLoading } =
    usePolkadotTreasurySummary();

  return (
    <SummaryItem
      title={
        <Link
          className="text12Medium"
          href={`https://statemint.statescan.io/#/accounts/${StatemintTreasuryAccount}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-textTertiary hover:underline">Asset Hub</span>
          <i className="text-textTertiary">&nbsp;↗</i>
        </Link>
      }
    >
      <LoadableContent isLoading={isMultiAssetsLoading}>
        <div>
          <FiatPriceLabel
            free={multiAssetsFree}
            USDCBalance={USDCBalance}
            USDtBalance={USDtBalance}
          />
        </div>
        <div className="!ml-0 flex flex-col gap-y-1">
          <DotTokenSymbolAsset free={multiAssetsFree} />
          <TokenSymbolAsset amount={USDCBalance} symbol="USDC" />
          <TokenSymbolAsset amount={USDtBalance} symbol="USDt" />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
