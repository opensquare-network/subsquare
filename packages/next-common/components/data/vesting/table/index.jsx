import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import columns from "./columns";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useState } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import useQueryVestingOnChainData from "next-common/components/data/hooks/useQueryVestingOnChainData";
import { MapDataList } from "next-common/components/dataList";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { useRouter } from "next/router";

// TODO: search &filter
function TableHeader({ total, loading }) {
  return (
    <div>
      <TitleContainer>
        <span>
          List
          <span className="text-textTertiary text16Medium ml-1">
            {!loading && total}
          </span>
        </span>
        {/* {MyRelatedSwitchComponent} */}
      </TitleContainer>
      {/* {SearchBoxComponent} */}
    </div>
  );
}

export default function VestingExplorerTable() {
  const { data, isLoading } = useQueryVestingOnChainData();

  const router = useRouter();
  const [dataList, setDataList] = useState([]);
  // TODO: filter
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    setTotal(data?.length);
  }, [data, isLoading]);

  const {
    page,
    component: pageComponent,
    setPage,
  } = usePaginationComponent(total, defaultPageSize);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const startIndex = (page - 1) * defaultPageSize;
    const endIndex = startIndex + defaultPageSize;
    setDataList(data?.slice(startIndex, endIndex));
  }, [data, page, isLoading]);

  useEffect(() => {
    if (router.query) {
      setPage(1);
    }
  }, [router.query, setPage]);

  return (
    <div className="flex flex-col gap-y-4">
      <TableHeader total={total} loading={isLoading} />
      <SecondaryCard className="space-y-2">
        <ScrollerX>
          <MapDataList
            columnsDef={columns}
            data={dataList}
            loading={isLoading}
            noDataText="No data"
          />
        </ScrollerX>
        {total > 0 && pageComponent}
      </SecondaryCard>
    </div>
  );
}
