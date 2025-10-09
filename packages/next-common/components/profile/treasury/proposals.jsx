import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";
import DataList from "next-common/components/dataList";
import useProfileAddress from "../useProfileAddress";
import { useMemo, useState } from "react";
import { TreasuryTag } from "next-common/components/tags/state/treasury";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Pagination from "next-common/components/pagination";
import {
  getProposalPostTitleColumn,
  getRequestColumn,
  getStatusTagColumn,
} from "next-common/components/overview/recentProposals/columns";
import businessCategory from "next-common/utils/consts/business/category";
import ListPostTitle from "next-common/components/postList/postTitle";
import { CHAIN } from "next-common/utils/constants";
import normalizeProposalListItem from "next-common/utils/viewfuncs/democracy/normalizeProposalListItem";
import { toPrecision } from "next-common/utils";

const columns = [
  getProposalPostTitleColumn(),
  getRequestColumn(),
  getStatusTagColumn({ category: businessCategory.treasuryProposals }),
];

const PAGE_SIZE = 10;

export default function ProfileTreasuryProposals() {
  const [page, setPage] = useState(1);
  const { symbol, decimals } = useChainSettings();
  const address = useProfileAddress();

  const { value, loading } = useAsync(async () => {
    const { result } = await backendApi.fetch(
      `beneficiaries/${address}/treasury-proposals`,
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
      const formattedItem = normalizeProposalListItem(CHAIN, item);
      return [
        <ListPostTitle
          key="proposal"
          className="line-clamp-1 mr-4 text14Medium"
          data={formattedItem}
          href={formattedItem.detailLink}
          ellipsis
        />,
        <ValueDisplay
          key="value"
          value={toPrecision(item.onchainData?.value, decimals)}
          symbol={symbol}
        />,
        <TreasuryTag key="status" state={item.state} />,
      ];
    });
  }, [value, symbol, decimals]);

  return (
    <>
      <div className="text16Bold text-textPrimary mx-6">
        Proposals
        <span className="text-textTertiary text14Medium ml-1">
          {value?.total}
        </span>
      </div>
      <SecondaryCard>
        <DataList
          loading={loading}
          columns={columns}
          rows={rows}
          noDataText="No proposals"
        />
        <Pagination
          buttonMode
          page={page}
          pageSize={PAGE_SIZE}
          total={value?.total}
          onPageChange={(_, newPage) => setPage(newPage)}
        />
      </SecondaryCard>
    </>
  );
}
