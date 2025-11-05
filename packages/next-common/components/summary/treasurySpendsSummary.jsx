import { usePageProps } from "next-common/context/page";
import ValueDisplay from "../valueDisplay";
import SummaryItem from "./layout/item";
import SummaryLayout from "./layout/layout";
import SummaryLabelItem from "./polkadotTreasurySummary/common/summaryLabelItem";
import { isNil } from "lodash-es";

export default function TreasurySpendsSummary() {
  const { spendsSummary } = usePageProps();

  if (isNil(spendsSummary)) {
    return null;
  }

  const { totalProposalsCount, detail = {} } = spendsSummary;

  return (
    <SummaryLayout>
      <SummaryItem title="Total">{totalProposalsCount}</SummaryItem>
      <SummaryItem title="Approved">
        <FiatValueItem
          count={detail?.Approved?.proposalsCount ?? 0}
          fiatValue={detail?.Approved?.fiatValue ?? 0}
        />
      </SummaryItem>
      <SummaryItem title="Paid">
        <FiatValueItem
          count={detail?.Paid?.proposalsCount ?? 0}
          fiatValue={detail?.Paid?.fiatValue ?? 0}
        />
      </SummaryItem>
      <SummaryItem title="Expired">
        <FiatValueItem
          count={detail?.Expired?.proposalsCount ?? 0}
          fiatValue={detail?.Expired?.fiatValue ?? 0}
        />
      </SummaryItem>
    </SummaryLayout>
  );
}

function FiatValueItem({ count, fiatValue }) {
  return (
    <div className="flex flex-col">
      {count ?? 0}
      <SummaryLabelItem label="total">
        <ValueDisplay
          className="text-textPrimary"
          value={fiatValue ?? 0}
          symbol=""
          prefix="$"
        />
      </SummaryLabelItem>
    </div>
  );
}
