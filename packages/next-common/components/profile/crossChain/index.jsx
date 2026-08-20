import { MapDataList } from "next-common/components/dataList";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import Spin from "next-common/components/spin";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { memo, useState } from "react";
import useCrossChainJourneys from "./hooks/useCrossChainJourneys";
import CursorPagination from "./pagination";
import PoweredBy from "./poweredBy";
import { useColumnsDef } from "./table";

function ProfileCrossChainContent() {
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState([null]);
  const cursor = cursors[page - 1] ?? null;
  const { isLoading, items, pageInfo } = useCrossChainJourneys(cursor);

  const hasNextPage = pageInfo.hasNextPage && Boolean(pageInfo.endCursor);

  const handleNextPage = () => {
    if (!hasNextPage) {
      return;
    }

    setCursors((currentCursors) => {
      return [...currentCursors.slice(0, page), pageInfo.endCursor];
    });
    setPage(page + 1);
  };

  return (
    <SecondaryCard>
      <Spin spinning={isLoading}>
        <CrossChainDataList data={items} />
      </Spin>
      <div className="mt-2 flex min-h-7 items-center justify-between gap-x-4">
        <PoweredBy />
        <CursorPagination
          disabled={isLoading}
          hasNextPage={hasNextPage}
          hasPreviousPage={page > 1}
          onFirstPage={() => setPage(1)}
          onNextPage={handleNextPage}
          onPreviousPage={() => setPage(page - 1)}
        />
      </div>
    </SecondaryCard>
  );
}

const CrossChainDataList = memo(function CrossChainDataList({ data }) {
  const columnsDef = useColumnsDef();

  return (
    <MapDataList
      columnsDef={columnsDef}
      data={data}
      noDataText="No cross-chain data"
    />
  );
});

export default function ProfileCrossChain() {
  const address = useProfileAddress();

  return <ProfileCrossChainContent key={address} />;
}
