import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";

export default function CuratorSummary({ totalFiat }) {
  return (
    <SummaryLayout className="w-auto grid-cols-1 max-sm:w-full max-sm:grid-cols-1">
      <SummaryItem title="Total" className="justify-start">
        <ValueDisplay
          className="text-textPrimary text20Bold"
          value={toPrecision(totalFiat)}
          symbol=""
          prefix="$"
        />
      </SummaryItem>
    </SummaryLayout>
  );
}
