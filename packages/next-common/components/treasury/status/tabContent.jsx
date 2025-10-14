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

const columns = [
  getBeneficiariesIdColumn(),
  getBeneficiariesProposalColumn(),
  getBeneficiariesAwardedColumn(),
];

export default function TreasuryStatusTabContent() {
  const [page, setPage] = useState(1);
  const { value: beneficiaries, loading } = useAsync(async () => {
    const { result } = await backendApi.fetch("/treasury/beneficiaries", {
      page,
      pageSize: defaultPageSize,
    });
    return result || EmptyList;
  }, [page]);

  const rows = useMemo(() => {
    return beneficiaries?.items?.map((beneficiary) =>
      columns.map((column) => column.cellRender?.(beneficiary)),
    );
  }, [beneficiaries]);

  return (
    <div>
      <TitleContainer className="mb-4 justify-start">
        Beneficiaries
        <span className="text14Medium text-textTertiary ml-1">
          {beneficiaries?.total}
        </span>
      </TitleContainer>
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
