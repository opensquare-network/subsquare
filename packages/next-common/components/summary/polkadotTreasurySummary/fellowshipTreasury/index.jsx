import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next/link";
import { StatemintFellowShipTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import PolkadotTokenSymbol from "../common/polkadotTokenSymbol";
import { useAssetHubApi } from "next-common/context/assetHub";
import { useSubscribeFellowshipTreasuryFree } from "../common/useSubscribeAssetHubTreasuryFree";
import FiatPriceLabel from "../common/fiatPriceLabel";

export default function FellowshipTreasury() {
  const api = useAssetHubApi();
  const { free, isLoading } = useSubscribeFellowshipTreasuryFree(
    api,
    StatemintFellowShipTreasuryAccount,
  );

  return (
    <SummaryItem
      title={
        <Link
          className="text12Medium"
          href={`https://statemint.statescan.io/#/accounts/${StatemintFellowShipTreasuryAccount}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-textTertiary hover:underline">
            Fellowship Treasury
          </span>
          <i className="text-textTertiary">↗</i>
        </Link>
      }
    >
      <LoadableContent isLoading={isLoading}>
        <div>
          <FiatPriceLabel free={free} />
        </div>
        <div className="!ml-0">
          <PolkadotTokenSymbol free={free} />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
