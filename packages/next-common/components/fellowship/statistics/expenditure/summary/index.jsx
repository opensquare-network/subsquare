import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import BigNumber from "bignumber.js";
import { normalizeSalaryAssetValue } from "next-common/components/collectives/salaryAssetValues";
import SalaryTotalWithTooltip from "next-common/components/collectives/salaryTotalWithTooltip";

function getTotalSpent(data) {
  if (data && data.length > 0) {
    let totalUsdt = new BigNumber(0);
    let totalHollar = new BigNumber(0);

    data.forEach((item) => {
      const registered = normalizeSalaryAssetValue(item.registeredPaid);
      const unRegistered = normalizeSalaryAssetValue(item.unRegisteredPaid);
      totalUsdt = totalUsdt
        .plus(registered.usdt || 0)
        .plus(unRegistered.usdt || 0);
      totalHollar = totalHollar
        .plus(registered.hollar || 0)
        .plus(unRegistered.hollar || 0);
    });

    return {
      usdt: totalUsdt.toString(),
      hollar: totalHollar.toString(),
      total: totalUsdt.plus(totalHollar),
    };
  }
  return { usdt: "0", hollar: "0", total: new BigNumber(0) };
}

function SpentCycles({ count }) {
  return <SummaryItem title="Salary Cycles">{count}</SummaryItem>;
}

function TotalSpent({ cycles }) {
  const { usdt, hollar } = getTotalSpent(cycles);
  return (
    <SummaryItem title="Total Spent">
      <SalaryTotalWithTooltip salary={{ usdt, hollar }} />
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
