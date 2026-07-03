import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import BigNumber from "bignumber.js";
import ValueDisplay from "next-common/components/valueDisplay";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { useSalaryAsset } from "next-common/hooks/fellowship/salary/useSalaryAsset";

function getTotalSpent(data) {
  if (data && data.length > 0) {
    const totalSpent = data.reduce((total, item) => {
      const { decimals } = getSalaryAsset(
        "fellowship",
        item.indexer?.blockHeight,
      );
      const registeredPaid = new BigNumber(item.registeredPaid || 0).div(
        10 ** decimals,
      );
      const unRegisteredPaid = new BigNumber(item.unRegisteredPaid || 0).div(
        10 ** decimals,
      );
      return total.plus(registeredPaid).plus(unRegisteredPaid);
    }, new BigNumber(0));
    return totalSpent;
  }
  return new BigNumber(0);
}

function SpentCycles({ count }) {
  return <SummaryItem title="Salary Cycles">{count}</SummaryItem>;
}

function TotalSpent({ cycles }) {
  const totalSpent = getTotalSpent(cycles);
  const { symbol } = useSalaryAsset();
  return (
    <SummaryItem title="Total Spent">
      <ValueDisplay value={totalSpent.toString()} symbol={symbol} />
    </SummaryItem>
  );
}

export default function StatisticsExpenditureSummary({ cycles = [], loading }) {
  if (loading) {
    return null;
  }

  return (
    <SecondaryCard>
      <SummaryLayout>
        <TotalSpent cycles={cycles} />
        <SpentCycles count={(cycles || []).length} />
      </SummaryLayout>
    </SecondaryCard>
  );
}
