import SummaryItem from "next-common/components/summary/layout/item";
import { useSelector } from "react-redux";
import { fellowshipSalaryStatusSelector } from "next-common/store/reducers/fellowship/salary";
import { isNil } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { ambassadorSalaryStatusSelector } from "next-common/store/reducers/ambassador/salary";

export default function SalaryStatsUnregisteredItem({ cycleData }) {
  const { section } = useCollectivesContext();
  const statusSelector =
    section === "fellowship"
      ? fellowshipSalaryStatusSelector
      : ambassadorSalaryStatusSelector;

  const stats = useSelector(statusSelector);

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
