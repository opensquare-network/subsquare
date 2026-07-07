import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import BigNumber from "bignumber.js";
import ValueDisplay from "next-common/components/valueDisplay";
import Tooltip from "next-common/components/tooltip";
import { normalizeSalaryAssetValue } from "next-common/components/collectives/salaryAssetValues";

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

function tooltipContent(salary) {
  const value = normalizeSalaryAssetValue(salary);
  const parts = [];
  if (new BigNumber(value.usdt || 0).gt(0)) {
    parts.push(
      <div key="usdt">
        <ValueDisplay value={value.usdt} symbol="USDT" showTooltip={false} />
      </div>,
    );
  }
  if (new BigNumber(value.hollar || 0).gt(0)) {
    parts.push(
      <div key="hollar">
        <ValueDisplay
          value={value.hollar}
          symbol="HOLLAR"
          showTooltip={false}
        />
      </div>,
    );
  }
  return parts.length > 0 ? parts : null;
}

function TotalSpent({ cycles }) {
  const { total, usdt, hollar } = getTotalSpent(cycles);
  return (
    <SummaryItem title="Total Spent">
      <Tooltip content={tooltipContent({ usdt, hollar })}>
        <ValueDisplay
          value={total.toString()}
          symbol="USD"
          showTooltip={false}
        />
      </Tooltip>
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
