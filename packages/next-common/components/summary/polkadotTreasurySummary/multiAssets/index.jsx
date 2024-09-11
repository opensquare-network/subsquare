import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next/link";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";

export default function MultiAssetsTreasury() {
   // TODO: address, totalBalance
   const address = "";
   const totalBalance = 123;
   const { decimals } = useChainSettings();
 

  return (
    <SummaryItem
      title={
        <Link
          className="text12Medium"
          href={`https://statemint.statescan.io/#/accounts/${address}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-textTertiary hover:underline">
            Multi Assets Treasury
          </span>
          <i className="text-textTertiary">↗</i>
        </Link>
      }
    >
      {/* TODO: loading */}
      <LoadableContent isLoading={false}>
        <div>
          <ValueDisplay
            key="value"
            value={toPrecision(totalBalance, decimals)}
            symbol={""}
          />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
