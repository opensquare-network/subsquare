import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import DataList from "next-common/components/dataList";
import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { useMemo, useState } from "react";
import Pagination from "next-common/components/pagination";
import {
  getBeneficiariesIdColumn,
  getBeneficiariesProposalColumn,
  getBeneficiariesValueAtAwardedTimeColumn,
  getBeneficiariesValueAtProposedTimeColumn,
} from "./columns";
import { useBeneficiarySortBy } from "./beneficiaryFilter";

export default function TreasuryStatusTabContent() {
  const [page, setPage] = useState(1);
  const { sortBy, component: sortByComponent } = useBeneficiarySortBy();
  const { value: beneficiaries, loading } = useAsync(async () => {
    const { result } = await backendApi.fetch("/treasury/beneficiaries", {
      ...(sortBy ? { sort_by: sortBy } : {}),
      page,
      pageSize: defaultPageSize,
    });
    return result || EmptyList;
  }, [sortBy, page]);

  const columns = useMemo(() => {
    return [
      getBeneficiariesIdColumn(),
      getBeneficiariesProposalColumn(),
      sortBy === "proposed_value"
        ? getBeneficiariesValueAtProposedTimeColumn()
        : getBeneficiariesValueAtAwardedTimeColumn(),
    ];
  }, [sortBy]);

  const rows = useMemo(() => {
    return beneficiaries?.items?.map((beneficiary) =>
      columns.map((column) => column.cellRender?.(beneficiary)),
    );
  }, [columns, beneficiaries]);

  return (
    <div>
      <div className="flex flex-wrap max-md:flex-col md:items-center gap-[12px] max-md:gap-[16px] justify-between pr-6 mb-4">
        <TitleContainer className="justify-start">
          Beneficiaries
          <span className="text14Medium text-textTertiary ml-1">
            {beneficiaries?.total}
          </span>
        </TitleContainer>
        {sortByComponent}
      </div>
      <SecondaryCard>
        <DataList
          noDataText="No Data"
          columns={columns}
          loading={loading && !rows?.length}
          rows={rows}
        />
        <Pagination
          buttonMode
          total={beneficiaries?.total}
          page={page}
          pageSize={defaultPageSize}
          onPageChange={(e, page) => {
            e.preventDefault();
            e.stopPropagation();
            setPage(page);
          }}
        />
      </SecondaryCard>
    </div>
  );
}
