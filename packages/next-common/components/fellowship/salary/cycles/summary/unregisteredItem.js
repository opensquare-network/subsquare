import SummaryItem from "next-common/components/summary/layout/item";
import { isNil } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";

export default function SalaryStatsUnregisteredItem({ cycleData }) {
  const stats = useFellowshipSalaryStats();

  const { totalUnregisteredPaid } = stats || {};
  const { decimals, symbol } = useSalaryAsset();
  const { unRegisteredPaidCount } = cycleData || {};

  return (
    <SummaryItem title="Total Unregistered Paid">
      <LoadableContent isLoading={isNil(totalUnregisteredPaid)}>
        <ValueDisplay
          value={toPrecision(totalUnregisteredPaid, decimals)}
          symbol={symbol}
        />
        {!isNil(unRegisteredPaidCount) && (
          <div className="text12Medium text-textSecondary !ml-0">
            {unRegisteredPaidCount} Members
          </div>
        )}
      </LoadableContent>
    </SummaryItem>
  );
}
