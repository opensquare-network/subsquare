import { MapDataList } from "next-common/components/dataList";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { memo, useState } from "react";
import useXcmJourneys from "./hooks/useCrossChainJourneys";
import CursorPagination from "./pagination";
import PoweredBy from "./poweredBy";
import { useColumnsDef } from "./table";

function ProfileXcmContent() {
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState([null]);
  const cursor = cursors[page - 1] ?? null;
  const { isLoading, items, pageInfo } = useXcmJourneys(cursor);

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
      <XcmDataList data={items} loading={isLoading && items.length === 0} />
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

const XcmDataList = memo(function XcmDataList({ data, loading }) {
  const columnsDef = useColumnsDef();

  return (
    <MapDataList
      columnsDef={columnsDef}
      data={data}
      loading={loading}
      noDataText="No XCM data"
    />
  );
});

export default function ProfileXcm() {
  const address = useProfileAddress();

  return <ProfileXcmContent key={address} />;
}
