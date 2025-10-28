import SpendPeriodLabelTip from "next-common/components/summary/labelTips/spendPeriod";
import SummaryItem from "next-common/components/summary/layout/item";
import TreasurySummarySpendPeriodCountDown from "next-common/components/summary/treasurySummary/spendPeriodCountDown";
import useSpendPeriodSummary from "next-common/components/summary/treasurySummary/useSpendPeriodSummary";
import SpendPeriodContent from "next-common/components/summary/treasurySummary/spendPeriod";
import { isEmpty } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";

export default function SpendPeriod() {
  const summary = useSpendPeriodSummary();
  return (
    <SummaryItem title={<SpendPeriodLabelTip />}>
      <LoadableContent isLoading={isEmpty(summary)}>
        <div className="flex items-center gap-x-4">
          <div className="space-x-1">
            <SpendPeriodContent summary={summary} />
          </div>
          <div className="[&_div]:text12Medium">
            <TreasurySummarySpendPeriodCountDown
              size={40}
              width={5}
              summary={summary}
            />
          </div>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
