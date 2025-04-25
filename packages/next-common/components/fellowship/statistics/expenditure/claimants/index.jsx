import DataList from "next-common/components/dataList";
import nextApi from "next-common/services/nextApi";
import { fellowshipStatisticsMembersApi } from "next-common/services/url";
import { defaultPageSize } from "next-common/utils/constants";
import { useAsync } from "react-use";
import { useStatisticsClaimantColumn } from "./columns/claimant";
import { useStatisticsClaimantsCyclesColumn } from "./columns/cycles";
import { useStatisticsClaimantsPaidColumn } from "./columns/paid";
import { useStatisticsClaimantsRankColumn } from "./columns/rank";
import { useState, useEffect } from "react";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { StatisticsTitle } from "next-common/components/statistics/styled.js";
import { isNil } from "lodash-es";

function handleClaimantsData(originalMembers, members) {
  // Pre-processing membersRank map.
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

function StatisticsClaimantsTable({ members = [] }) {
  const [total, setTotal] = useState(0);
  const [processedData, setProcessedData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const { page, component: pageComponent } = usePaginationComponent(
    total,
    defaultPageSize,
  );
  const membersApi = fellowshipStatisticsMembersApi;

  const columns = [
    useStatisticsClaimantsRankColumn(),
    useStatisticsClaimantColumn(),
    useStatisticsClaimantsCyclesColumn(),
    useStatisticsClaimantsPaidColumn(),
  ];
  const { value: originalMembers } = useAsync(async () => {
    setTableLoading(true);
    if (!membersApi) {
      return [];
    }
    try {
      const resp = await nextApi.fetch(membersApi, {
        page,
        pageSize: defaultPageSize,
      });
      return resp?.result || [];
    } catch (error) {
      setTableLoading(false);
      return [];
    }
  }, []);

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

export default function StatisticsClaimants({ members = [] }) {
  return (
    <SecondaryCard>
      <div className="flex flex-col gap-[16px] h-full">
        <StatisticsTitle>Top Claimants</StatisticsTitle>
        <StatisticsClaimantsTable members={members} />
      </div>
    </SecondaryCard>
  );
}
