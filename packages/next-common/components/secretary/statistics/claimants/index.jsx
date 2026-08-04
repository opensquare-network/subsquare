import { useMemo } from "react";
import DataList from "next-common/components/dataList";
import { defaultPageSize } from "next-common/utils/constants";
import { useStatisticsClaimantColumn } from "../../../fellowship/statistics/expenditure/claimants/columns/claimant";
import { useStatisticsClaimantsCyclesColumn } from "../../../fellowship/statistics/expenditure/claimants/columns/cycles";
import { useStatisticsClaimantsRankColumn } from "../../../fellowship/statistics/expenditure/claimants/columns/rank";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { StatisticsTitle } from "next-common/components/statistics/styled.js";
import { isNil } from "lodash-es";
import BigNumber from "bignumber.js";
import PaymentReferendaTooltip from "next-common/components/secretary/statistics/paymentReferendaTooltip";
import AssetBreakdown from "next-common/components/secretary/statistics/assetBreakdown";
import {
  getReferendaTotalByAddress,
  getReferendaUsdByAddress,
} from "next-common/components/secretary/statistics/breakdown";
import SalaryAssetValues, {
  isPositiveAmount,
} from "next-common/components/collectives/salaryAssetValues";
import { formatNum } from "next-common/utils";

function handleClaimantsData(originalMembers, members) {
  const membersRank = members.reduce((acc, member) => {
    acc[member.address] = member.rank;
    return acc;
  }, {});

  return originalMembers.map((item) => ({
    ...item,
    rank: !isNil(membersRank[item.who]) ? membersRank[item.who] : null,
  }));
}

function paginateData(data, page, pageSize) {
  const start = (page - 1) * pageSize;
  const end = page * pageSize;
  return data.slice(start, end);
}

function ReferendaCell({ paymentReferenda = [] }) {
  if (!paymentReferenda.length) {
    return <span className="text14Medium text-textTertiary">-</span>;
  }

  return (
    <PaymentReferendaTooltip paymentReferenda={paymentReferenda}>
      <span className="text14Medium cursor-pointer">
        {paymentReferenda.length}
      </span>
    </PaymentReferendaTooltip>
  );
}

function useSecretaryClaimantsReferendaColumn(paymentReferenda) {
  const referendaByAddress = useMemo(() => {
    const map = {};
    for (const ref of paymentReferenda || []) {
      if (!map[ref.beneficiary]) {
        map[ref.beneficiary] = [];
      }
      map[ref.beneficiary].push(ref);
    }
    return map;
  }, [paymentReferenda]);

  return {
    name: "Referenda",
    width: 160,
    cellRender(data) {
      const refs = referendaByAddress[data.who] || [];
      return <ReferendaCell paymentReferenda={refs} />;
    },
  };
}

function useSecretaryClaimantsPaidColumn(paymentReferenda) {
  return {
    name: "Total Paid",
    className: "text-right",
    width: 240,
    cellRender(data, idx) {
      const salary = data.salary || {};
      const usdt = salary.usdt || "0";
      const hollar = salary.hollar || "0";
      const address = data.who;
      const referendaTotal = getReferendaTotalByAddress(
        paymentReferenda,
        address,
      );

      const hasHollar = isPositiveAmount(hollar);
      const hasUsdt = isPositiveAmount(usdt);

      if (referendaTotal.isZero()) {
        return <SalaryAssetValues key={idx} salary={salary} />;
      }

      const referendaUsd = getReferendaUsdByAddress(paymentReferenda, address);
      const salaryUsd = new BigNumber(usdt).plus(hollar);
      const usdTotal = salaryUsd.plus(referendaUsd).toFixed(2);

      const rows = [];

      if (hasUsdt) {
        rows.push({
          value: new BigNumber(usdt).toFixed(2),
          symbol: "USDT",
        });
      }

      if (hasHollar) {
        rows.push({
          value: new BigNumber(hollar).toFixed(2),
          symbol: "HOLLAR",
        });
      }

      if (referendaTotal.gt(0)) {
        rows.push({
          value: referendaTotal.shiftedBy(-10).toFixed(4),
          symbol: "DOT",
        });
      }

      return (
        <AssetBreakdown
          key={idx}
          align="right"
          usdTotal={formatNum(usdTotal)}
          rows={rows}
        />
      );
    },
  };
}

function SecretaryClaimantsTable({
  members = [],
  paymentReferenda = [],
  membersData = [],
  membersLoading = false,
}) {
  const pageSize = defaultPageSize;

  const processedData = useMemo(
    () =>
      membersLoading || !members
        ? membersData
        : handleClaimantsData(membersData, members),
    [membersData, members, membersLoading],
  );

  const total = processedData.length;
  const { page, component: pageComponent } = usePaginationComponent(
    total,
    pageSize,
  );

  const columns = [
    useStatisticsClaimantsRankColumn(),
    useStatisticsClaimantColumn(),
    useStatisticsClaimantsCyclesColumn(),
    useSecretaryClaimantsReferendaColumn(paymentReferenda),
    useSecretaryClaimantsPaidColumn(paymentReferenda),
  ];

  const rowData = useMemo(() => {
    if (processedData.length <= 0) {
      return [];
    }
    const paginatedData = paginateData(processedData, page, defaultPageSize);
    return paginatedData.map((item, idx) =>
      columns.map((col) => col.cellRender(item, idx)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processedData, page]);

  return (
    <div>
      <DataList noDataText="No data" columns={columns} rows={rowData} />
      {pageComponent}
    </div>
  );
}

export default function SecretaryStatisticsClaimants({
  members = [],
  membersLoading = false,
  paymentReferenda = [],
  membersData = [],
}) {
  return (
    <SecondaryCard>
      <div className="flex flex-col gap-4 h-full">
        <StatisticsTitle>Top Beneficiary</StatisticsTitle>
        <SecretaryClaimantsTable
          members={members}
          membersLoading={membersLoading}
          paymentReferenda={paymentReferenda}
          membersData={membersData}
        />
      </div>
    </SecondaryCard>
  );
}
