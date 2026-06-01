import { useMemo } from "react";
import DataList from "next-common/components/dataList";
import { backendApi } from "next-common/services/nextApi";
import { fellowshipStatisticsMembersApi } from "next-common/services/url";
import { defaultPageSize } from "next-common/utils/constants";
import { useAsync } from "react-use";
import { useStatisticsClaimantColumn } from "../../../fellowship/statistics/expenditure/claimants/columns/claimant";
import { useStatisticsClaimantsCyclesColumn } from "../../../fellowship/statistics/expenditure/claimants/columns/cycles";
import { useStatisticsClaimantsRankColumn } from "../../../fellowship/statistics/expenditure/claimants/columns/rank";
import { useState, useEffect } from "react";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { StatisticsTitle } from "next-common/components/statistics/styled.js";
import { isNil } from "lodash-es";
import Link from "next-common/components/link";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { toPrecision } from "next-common/utils";

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
    <span className="inline-flex flex-wrap gap-1">
      {paymentReferenda.map((ref) => (
        <Tooltip
          key={ref.referendumIndex}
          content={
            <span>
              <span className="font-bold">
                {toPrecision(ref.value, ref.decimals)} {ref.symbol}
              </span>
              {" · "}
              {ref.title}
            </span>
          }
        >
          <Link
            href={`/fellowship/referenda/${ref.referendumIndex}`}
            className="text14Medium text-theme500 hover:underline"
          >
            #{ref.referendumIndex}
          </Link>
        </Tooltip>
      ))}
    </span>
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
  const referendaTotalByAddress = useMemo(() => {
    const map = {};
    for (const ref of paymentReferenda || []) {
      if (ref.beneficiary) {
        map[ref.beneficiary] =
          (map[ref.beneficiary] || BigInt(0)) + BigInt(ref.value || 0);
      }
    }
    return map;
  }, [paymentReferenda]);

  const { decimals, symbol } = getSalaryAsset();

  return {
    name: "Total Paid",
    width: 160,
    className: "text-right",
    cellRender(data, idx) {
      const extra = referendaTotalByAddress[data.who] || BigInt(0);
      const totalSalary = BigInt(data.salary || 0) + extra;
      return (
        <ValueDisplay
          key={idx}
          value={toPrecision(totalSalary.toString(), decimals)}
          symbol={symbol}
        />
      );
    },
  };
}

function SecretaryClaimantsTable({
  members = [],
  membersApi = fellowshipStatisticsMembersApi,
  paymentReferenda = [],
}) {
  const [total, setTotal] = useState(0);
  const [processedData, setProcessedData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const pageSize = defaultPageSize;
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

  const { value: originalMembers } = useAsync(async () => {
    setTableLoading(true);
    if (!membersApi) {
      return [];
    }
    try {
      const resp = await backendApi.fetch(membersApi, {
        page,
        pageSize: defaultPageSize,
      });
      return resp?.result || [];
    } catch {
      setTableLoading(false);
      return [];
    }
  }, [membersApi]);

  useEffect(() => {
    if (originalMembers && members) {
      const processed = handleClaimantsData(originalMembers, members);
      setProcessedData(processed);
      setTotal(processed.length);
      setTableLoading(false);
    }
  }, [originalMembers, members]);

  useEffect(() => {
    if (processedData.length > 0) {
      const paginatedData = paginateData(processedData, page, defaultPageSize);
      const rows = paginatedData.map((item, idx) =>
        columns.map((col) => col.cellRender(item, idx)),
      );
      setRowData(rows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processedData, page]);

  return (
    <div>
      <DataList
        noDataText="No data"
        loading={tableLoading}
        columns={columns}
        rows={rowData}
      />
      {pageComponent}
    </div>
  );
}

export default function SecretaryStatisticsClaimants({
  members = [],
  membersApi = fellowshipStatisticsMembersApi,
  paymentReferenda = [],
}) {
  return (
    <SecondaryCard>
      <div className="flex flex-col gap-4 h-full">
        <StatisticsTitle>Top Beneficiary</StatisticsTitle>
        <SecretaryClaimantsTable
          members={members}
          membersApi={membersApi}
          paymentReferenda={paymentReferenda}
        />
      </div>
    </SecondaryCard>
  );
}
