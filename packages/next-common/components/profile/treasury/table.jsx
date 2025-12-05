import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";
import DataList from "next-common/components/dataList";
import useProfileAddress from "../useProfileAddress";
import { useMemo, useState } from "react";
import Pagination from "next-common/components/pagination";
import { getProposalPostTitleColumn } from "next-common/components/overview/recentProposals/columns";
import {
  getRequestColumn,
  getSpendRequestColumn,
  getStatusTagColumn,
} from "./column";
import { CHAIN } from "next-common/utils/constants";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeProposalListItem";
import normalizeTreasurySpendListItem from "next-common/utils/viewfuncs/treasury/normalizeTreasurySpendListItem";
import normalizeBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeBountyListItem";
import normalizeChildBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeChildBountyListItem";
import normalizeTipListItem from "next-common/utils/viewfuncs/treasury/normalizeTipListItem";

const commonColumns = [getProposalPostTitleColumn(), getRequestColumn()];
const PAGE_SIZE = 10;

const tableTemplateMap = {
  spends: {
    columns: [
      getProposalPostTitleColumn(),
      getSpendRequestColumn(),
      getStatusTagColumn({ category: businessCategory.treasurySpends }),
    ],
    apiSubfix: "treasury-spends",
    formatter: normalizeTreasurySpendListItem,
  },
  proposals: {
    columns: [
      ...commonColumns,
      getStatusTagColumn({ category: businessCategory.treasuryProposals }),
    ],
    apiSubfix: "treasury-proposals",
    formatter: normalizeTreasuryProposalListItem,
  },
  bounties: {
    columns: [
      ...commonColumns,
      getStatusTagColumn({ category: businessCategory.treasuryBounties }),
    ],
    apiSubfix: "bounties",
    formatter: normalizeBountyListItem,
  },
  "child-bounties": {
    columns: [
      ...commonColumns,
      getStatusTagColumn({ category: businessCategory.treasuryChildBounties }),
    ],
    apiSubfix: "child-bounties",
    formatter: normalizeChildBountyListItem,
  },
  tips: {
    columns: [
      ...commonColumns,
      getStatusTagColumn({ category: businessCategory.treasuryTips }),
    ],
    apiSubfix: "tips",
    formatter: normalizeTipListItem,
  },
};

function ProfileTreasuryCommonTableImpl({ apiSubfix, formatter, columns }) {
  const [page, setPage] = useState(1);
  const address = useProfileAddress();

  const { value, loading } = useAsync(async () => {
    const { result } = await backendApi.fetch(
      `beneficiaries/${address}/${apiSubfix}`,
      {
        page,
        pageSize: PAGE_SIZE,
        simple: true,
      },
    );

    return result;
  }, [address, page]);

  const rows = useMemo(() => {
    return value?.items?.map((item) => {
      const formattedItem = formatter(CHAIN, item);
      return columns.map((column) =>
        column.cellRender?.(formattedItem, item, value.items),
      );
    });
  }, [value, formatter, columns]);

  return (
    <>
      <DataList
        loading={loading}
        columns={columns}
        rows={rows}
        noDataText="No data"
      />
      <Pagination
        buttonMode
        page={page}
        pageSize={PAGE_SIZE}
        total={value?.total}
        onPageChange={(_, newPage) => setPage(newPage)}
      />
    </>
  );
}

export default function ProfileTreasuryCommonTable({ type }) {
  const tableTemplate = tableTemplateMap[type];

  if (!tableTemplate) {
    return null;
  }

  return <ProfileTreasuryCommonTableImpl {...tableTemplate} />;
}
