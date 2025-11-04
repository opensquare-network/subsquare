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
  getBeneficiariesAwardedColumn,
} from "./columns";
import BeneficiaryFilter from "./beneficiaryFilter";
import { useCommittedFilterState } from "next-common/components/dropdownFilter/context";

export default function TreasuryStatusTabContent() {
  const [page, setPage] = useState(1);
  const [{ sort_by }] = useCommittedFilterState();
  const { value: beneficiaries, loading } = useAsync(async () => {
    const { result } = await backendApi.fetch("/treasury/beneficiaries", {
      ...(sort_by ? { sort_by } : {}),
      page,
      pageSize: defaultPageSize,
    });
    return result || EmptyList;
  }, [sort_by, page]);

  const columns = useMemo(() => {
    return [
      getBeneficiariesIdColumn(),
      getBeneficiariesProposalColumn(),
      getBeneficiariesAwardedColumn(
        sort_by === "awarded_value"
          ? "Awarded (value at awarded time)"
          : "Awarded (value at proposed time)",
      ),
    ];
  }, [sort_by]);

  const rows = useMemo(() => {
    return beneficiaries?.items?.map((beneficiary) =>
      columns.map((column) => column.cellRender?.(beneficiary)),
    );
  }, [columns, beneficiaries]);

  return (
    <div>
      <div className="flex flex-wrap max-md:flex-col md:items-center gap-[12px] max-md:gap-[16px] justify-between pr-6">
        <TitleContainer className="mb-4 justify-start">
          Beneficiaries
          <span className="text14Medium text-textTertiary ml-1">
            {beneficiaries?.total}
          </span>
        </TitleContainer>
        <BeneficiaryFilter />
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
