import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import BigNumber from "bignumber.js";
import { LoadingContent } from "next-common/components/fellowship/statistics/common";
import PaymentReferendaTooltip from "next-common/components/secretary/statistics/paymentReferendaTooltip";
import AssetBreakdown from "next-common/components/secretary/statistics/assetBreakdown";

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

function computeReferendaUsd(paymentReferenda) {
  return (paymentReferenda || []).reduce((total, ref) => {
    const value = new BigNumber(ref.value || 0);
    const amount = value.div(new BigNumber(10).pow(ref.decimals || 10));
    return total.plus(amount.times(ref.price || 0));
  }, new BigNumber(0));
}

function TotalSpent({ cycles, paymentReferenda }) {
  const cyclesTotal = getCyclesTotalSpent(cycles);
  const referendaTotal = getReferendaTotalSpent(paymentReferenda);
  const referendaUsd = computeReferendaUsd(paymentReferenda);

  const rows = [{ value: cyclesTotal.toString(), decimals: 6, symbol: "USDT" }];

  if (referendaTotal.gt(0)) {
    rows.push({
      value: referendaTotal.toString(),
      decimals: 10,
      symbol: "DOT",
    });
  }

  return (
    <SummaryItem title="Total Spent">
      <AssetBreakdown rows={rows} usdExtra={referendaUsd} />
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
          <PaymentReferendaTooltip paymentReferenda={paymentReferenda}>
            <span className="cursor-pointer">
              {paymentReferenda?.length || 0}
            </span>
          </PaymentReferendaTooltip>
        </SummaryItem>
      </SummaryLayout>
    </SecondaryCard>
  );
}
