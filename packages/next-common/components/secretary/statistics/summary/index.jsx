import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import BigNumber from "bignumber.js";
import ValueDisplay from "next-common/components/valueDisplay";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { toPrecision } from "next-common/utils";
import { LoadingContent } from "next-common/components/fellowship/statistics/common";

function getCyclesTotalSpent(cycles) {
  if (cycles && cycles.length > 0) {
    return cycles.reduce((total, item) => {
      const registeredPaid = new BigNumber(item.registeredPaid || 0);
      const unRegisteredPaid = new BigNumber(item.unRegisteredPaid || 0);
      return total.plus(registeredPaid).plus(unRegisteredPaid);
    }, new BigNumber(0));
  }
  return new BigNumber(0);
}

function getReferendaTotalSpent(paymentReferenda) {
  if (paymentReferenda && paymentReferenda.length > 0) {
    return paymentReferenda.reduce((total, item) => {
      return total.plus(new BigNumber(item.value || 0));
    }, new BigNumber(0));
  }
  return new BigNumber(0);
}

function TotalSpent({ cycles, paymentReferenda }) {
  const cyclesTotal = getCyclesTotalSpent(cycles);
  const referendaTotal = getReferendaTotalSpent(paymentReferenda);
  const { symbol, decimals } = getSalaryAsset();
  return (
    <SummaryItem title="Total Spent">
      <div className="flex flex-col">
        <ValueDisplay
          value={toPrecision(cyclesTotal.toString(), decimals)}
          symbol={symbol}
        />
        {referendaTotal.gt(0) && (
          <ValueDisplay
            value={toPrecision(referendaTotal.toString(), 10)}
            symbol="DOT"
          />
        )}
      </div>
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
