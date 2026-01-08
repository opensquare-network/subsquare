import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import DataList from "next-common/components/dataList";
import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { useMemo, useState } from "react";
import Pagination from "next-common/components/pagination";
import Tooltip from "next-common/components/tooltip";
import {
  getBeneficiariesIdColumn,
  getBeneficiariesProposalColumn,
  getBeneficiariesValueAtAwardedTimeColumn,
  getBeneficiariesTagsColumn,
} from "./columns";

export default function TreasuryStatusTabContent() {
  const [page, setPage] = useState(1);
  const { value: beneficiaries, loading } = useAsync(async () => {
    const { result } = await backendApi.fetch("/treasury/beneficiaries", {
      sort_by: "awarded_value",
      page,
      pageSize: defaultPageSize,
    });
    return result || EmptyList;
  }, [page]);

  const columns = useMemo(() => {
    return [
      getBeneficiariesIdColumn(),
      getBeneficiariesTagsColumn(),
      getBeneficiariesProposalColumn(),
      getBeneficiariesValueAtAwardedTimeColumn(),
    ];
  }, []);

  const rows = useMemo(() => {
    return beneficiaries?.items?.map((beneficiary) =>
      columns.map((column) => column.cellRender?.(beneficiary)),
    );
  }, [columns, beneficiaries]);

  return (
    <div>
      <div className="flex flex-wrap max-md:flex-col md:items-center gap-[12px] max-md:gap-[16px] justify-between pr-6 mb-4">
        <TitleContainer className="justify-start inline-flex items-center gap-x-1">
          Beneficiaries
          <Tooltip content="The prices are calculated at awarded time."></Tooltip>
          <span className="text14Medium text-textTertiary ml-1">
            {beneficiaries?.total}
          </span>
        </TitleContainer>
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
