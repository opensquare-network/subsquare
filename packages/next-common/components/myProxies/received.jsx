import { MapDataList } from "next-common/components/dataList";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useState } from "react";
import {
  delegatorColumn,
  typeColumn,
  useDelayBlockOrTimeColumn,
} from "./common/columns";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useReceivedProxiesContext } from "./context/received";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import HeaderPrompt from "next-common/components/profile/proxy/common/headerPrompt";

export default function ReceivedProxies() {
  const { data, total, loading } = useReceivedProxiesContext();
  const [dataList, setDataList] = useState([]);

  const { page, component: pageComponent } = usePaginationComponent(
    total,
    defaultPageSize,
  );

  const delayBlockOrTimeColumn = useDelayBlockOrTimeColumn();
  const columns = [delegatorColumn, typeColumn, delayBlockOrTimeColumn];

  useEffect(() => {
    if (loading) {
      return;
    }

    const startIndex = (page - 1) * defaultPageSize;
    const endIndex = startIndex + defaultPageSize;
    setDataList(data?.slice(startIndex, endIndex));
  }, [data, page, loading]);

  return (
    <SecondaryCard className="space-y-4">
      <HeaderPrompt
        content={
          "I'm a delegatee and I can submit extrinsics on behalf of others."
        }
      />
      <MapDataList
        loading={loading}
        noDataText="No proxy delegators"
        columnsDef={columns}
        data={dataList}
      />
      {total > 0 && pageComponent}
    </SecondaryCard>
  );
}
