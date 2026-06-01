import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import BigNumber from "bignumber.js";
import ValueDisplay from "next-common/components/valueDisplay";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { toPrecision } from "next-common/utils";
import { LoadingContent } from "next-common/components/fellowship/statistics/common";

function getTotalSpent(cycles, paymentReferenda = []) {
  let total = new BigNumber(0);

  if (cycles && cycles.length > 0) {
    total = cycles.reduce((acc, item) => {
      const registeredPaid = new BigNumber(item.registeredPaid || 0);
      const unRegisteredPaid = new BigNumber(item.unRegisteredPaid || 0);
      return acc.plus(registeredPaid).plus(unRegisteredPaid);
    }, total);
  }

  if (paymentReferenda.length > 0) {
    total = paymentReferenda.reduce((acc, item) => {
      return acc.plus(new BigNumber(item.value || 0));
    }, total);
  }

  return total;
}

function TotalSpent({ cycles, paymentReferenda }) {
  const totalSpent = getTotalSpent(cycles, paymentReferenda);
  const { symbol, decimals } = getSalaryAsset();
  return (
    <SummaryItem title="Total Spent">
      <ValueDisplay
        value={toPrecision(totalSpent.toString(), decimals)}
        symbol={symbol}
      />
    </SummaryItem>
  );
}

function SpentCycles({ count }) {
  return <SummaryItem title="Salary Cycles">{count}</SummaryItem>;
}

export default function SecretaryStatisticsSummary({
  cycles = [],
  paymentReferenda = [],
  loading,
}) {
  if (loading) {
    return (
      <SecondaryCard>
        <LoadingContent />
      </SecondaryCard>
    );
  }

  return (
    <SecondaryCard>
      <SummaryLayout>
        <TotalSpent cycles={cycles} paymentReferenda={paymentReferenda} />
        <SpentCycles count={(cycles || []).length} />
        <SummaryItem title="Payment Referenda">
          {paymentReferenda?.length || 0}
        </SummaryItem>
      </SummaryLayout>
    </SecondaryCard>
  );
}
