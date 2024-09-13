import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next/link";
import { StatemintFellowShipTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import PolkadotTokenSymbol from "../common/polkadotTokenSymbol";
import { useSubscribeFellowshipTreasuryFree } from "../common/useSubscribeAssetHubTreasuryFree";
import FiatPriceLabel from "../common/fiatPriceLabel";
import { useEffect } from "react";

export default function FellowshipTreasury({ setFellowshipFree }) {
  const { free, isLoading } = useSubscribeFellowshipTreasuryFree(
    StatemintFellowShipTreasuryAccount,
  );

  useEffect(() => {
    if (!free) return;

    setFellowshipFree(free);
  }, [free, setFellowshipFree]);

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
