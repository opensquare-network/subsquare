import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import BigNumber from "bignumber.js";
import ValueDisplay from "next-common/components/valueDisplay";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { toPrecision } from "next-common/utils";

function getTotalSpent(data) {
  if (data && data.length > 0) {
    const totalSpent = data.reduce((total, item) => {
      const registeredPaid = new BigNumber(item.registeredPaid);
      const unRegisteredPaid = new BigNumber(item.unRegisteredPaid);
      return total.plus(registeredPaid).plus(unRegisteredPaid);
    }, new BigNumber(0));
    return totalSpent;
  }
  return new BigNumber(0);
}

function SpentCycles({ data }) {
  return <SummaryItem title="Spend Cycles">{data.length}</SummaryItem>;
}

function TotalSpent({ data }) {
  const totalSpent = getTotalSpent(data);
  const { symbol, decimals } = useSalaryAsset();
  return (
    <SummaryItem title="Total Spent">
      <ValueDisplay
        value={toPrecision(totalSpent.toString(), decimals)}
        symbol={symbol}
      />
    </SummaryItem>
  );
}

export default function StatisticsExpenditureSummary({ value = [], loading }) {
  if (loading) {
    return null;
  }
  return (
    <SecondaryCard>
      <SummaryLayout>
        <TotalSpent data={value} />
        <SpentCycles data={value} />
      </SummaryLayout>
    </SecondaryCard>
  );
}
