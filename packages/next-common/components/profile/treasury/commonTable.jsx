import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";
import DataList from "next-common/components/dataList";
import useProfileAddress from "../useProfileAddress";
import { useMemo, useState } from "react";
import Pagination from "next-common/components/pagination";
import {
  getProposalPostTitleColumn,
  getRequestColumn,
} from "next-common/components/overview/recentProposals/columns";
import { getStatusTagColumn } from "./column";
import { CHAIN } from "next-common/utils/constants";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeProposalListItem";
import normalizeTreasurySpendListItem from "next-common/utils/viewfuncs/treasury/normalizeTreasurySpendListItem";
import normalizeBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeBountyListItem";
import normalizeChildBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeChildBountyListItem";
import normalizeTipListItem from "next-common/utils/viewfuncs/treasury/normalizeTipListItem";

const commonColumns = [getProposalPostTitleColumn(), getRequestColumn()];

const columnsMap = {
  spends: [
    ...commonColumns,
    getStatusTagColumn({ category: businessCategory.treasurySpends }),
  ],
  proposals: [
    ...commonColumns,
    getStatusTagColumn({ category: businessCategory.treasuryProposals }),
  ],
  bounties: [
    ...commonColumns,
    getStatusTagColumn({ category: businessCategory.treasuryBounties }),
  ],
  "child-bounties": [
    ...commonColumns,
    getStatusTagColumn({ category: businessCategory.treasuryChildBounties }),
  ],
  tips: [
    ...commonColumns,
    getStatusTagColumn({ category: businessCategory.treasuryTips }),
  ],
};

const PAGE_SIZE = 10;

const apiSubfixMap = {
  spends: "treasury-spends",
  proposals: "treasury-proposals",
  bounties: "bounties",
  "child-bounties": "child-bounties",
  tips: "tips",
};

const formatterMap = {
  spends: normalizeTreasurySpendListItem,
  proposals: normalizeTreasuryProposalListItem,
  bounties: normalizeBountyListItem,
  "child-bounties": normalizeChildBountyListItem,
  tips: normalizeTipListItem,
};

export default function ProfileTreasuryCommonTable({ type }) {
  const [page, setPage] = useState(1);
  const address = useProfileAddress();
  const apiSubfix = apiSubfixMap[type];

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
      const formattedItem = formatterMap[type]?.(CHAIN, item);
      const columns = columnsMap[type];
      return columns.map((column) =>
        column.cellRender?.(formattedItem, item, value.items),
      );
    });
  }, [value, type]);

  return (
    <>
      <DataList
        loading={loading}
        columns={columnsMap[type]}
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
