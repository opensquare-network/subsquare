import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import { formatNum } from "next-common/utils";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { LoadingContent } from "next-common/components/fellowship/statistics/common";
import PaymentReferendaTooltip from "next-common/components/secretary/statistics/paymentReferendaTooltip";
import AssetBreakdown from "next-common/components/secretary/statistics/assetBreakdown";
import {
  getCyclesTotal,
  getReferendaTotal,
  getReferendaUsd,
} from "next-common/components/secretary/statistics/breakdown";

function TotalSpent({ cycles, paymentReferenda }) {
  const { decimals: salaryDecimals } = getSalaryAsset();
  const cyclesTotal = getCyclesTotal(cycles);
  const referendaTotal = getReferendaTotal(paymentReferenda);
  const referendaUsd = getReferendaUsd(paymentReferenda);

  const cyclesUsd = cyclesTotal.div(Math.pow(10, salaryDecimals));
  const usdTotal = formatNum(cyclesUsd.plus(referendaUsd).toFixed(2));

  const rows = [
    { value: cyclesTotal.toString(), decimals: salaryDecimals, symbol: "USDT" },
  ];

  if (referendaTotal.gt(0)) {
    rows.push({
      value: referendaTotal.toString(),
      decimals: 10,
      symbol: "DOT",
    });
  }

  return (
    <SummaryItem title="Total Spent">
      <AssetBreakdown usdTotal={usdTotal} rows={rows} />
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
