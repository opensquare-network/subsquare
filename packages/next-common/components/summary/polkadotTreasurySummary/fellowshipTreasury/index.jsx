import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next/link";
import { StatemintFellowShipTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import DotTokenSymbolAsset from "../common/dotTokenSymbolAsset";
import FiatPriceLabel from "../common/fiatPriceLabel";
import { usePolkadotTreasurySummary } from "../context";

export default function FellowshipTreasury() {
  const { fellowshipFree, isFellowshipLoading } = usePolkadotTreasurySummary();

  return (
    <SummaryItem
      title={
        <Link
          className="text12Medium"
          href={`https://assethub-polkadot.subscan.io/account/${StatemintFellowShipTreasuryAccount}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-textTertiary hover:underline">Fellowship</span>
          <i className="text-textTertiary">&nbsp;↗</i>
        </Link>
      }
    >
      <LoadableContent isLoading={isFellowshipLoading}>
        <div>
          <FiatPriceLabel free={fellowshipFree} />
        </div>
        <div className="!ml-0">
          <DotTokenSymbolAsset free={fellowshipFree} />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
