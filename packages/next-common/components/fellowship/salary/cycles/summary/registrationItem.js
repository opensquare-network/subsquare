import { useSelector } from "react-redux";
import { fellowshipSalaryStatusSelector } from "next-common/store/reducers/fellowship/salary";
import SummaryItem from "next-common/components/summary/layout/item";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { isNil } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";

export default function SalaryStatsRegistrationItem({ cycleData }) {
  const stats = useSelector(fellowshipSalaryStatusSelector);
  const { totalRegistrations } = stats || {};
  const { decimals, symbol } = useSalaryAsset();
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
