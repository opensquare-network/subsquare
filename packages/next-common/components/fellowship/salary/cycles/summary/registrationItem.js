import SummaryItem from "next-common/components/summary/layout/item";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { isNil } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useFellowshipSalaryStats } from "../../../../../hooks/fellowship/salary/useFellowshipSalaryStats";

export default function SalaryStatsRegistrationItem({ cycleData }) {
  const stats = useFellowshipSalaryStats();

  const { totalRegistrations } = stats || {};
  const { decimals, symbol } = getSalaryAsset();
  const { registeredCount } = cycleData || {};

  return (
    <SummaryItem title="Total Registrations">
      <LoadableContent isLoading={isNil(totalRegistrations)}>
        <ValueDisplay
          value={toPrecision(totalRegistrations, decimals)}
          symbol={symbol}
        />
        {!isNil(registeredCount) && (
          <div className="text12Medium text-textSecondary !ml-0">
            {registeredCount} Members
          </div>
        )}
      </LoadableContent>
    </SummaryItem>
  );
}
