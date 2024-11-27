import { MapDataList } from "next-common/components/dataList";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useState } from "react";
import {
  delegateeColumn,
  typeColumn,
  useDelayBlockOrTimeColumn,
} from "./common/columns";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useMyProxiesContext } from "./context/myProxies";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import PromptContent from "./common/promptContent";

export default function MyProxies() {
  const { data, total, loading } = useMyProxiesContext();
  const [dataList, setDataList] = useState([]);

  const { page, component: pageComponent } = usePaginationComponent(
    total,
    defaultPageSize,
  );

  const delayBlockOrTimeColumn = useDelayBlockOrTimeColumn();
  const columns = [delegateeColumn, typeColumn, delayBlockOrTimeColumn];

  useEffect(() => {
    const startIndex = (page - 1) * defaultPageSize;
    const endIndex = startIndex + defaultPageSize;
    setDataList(data?.slice(startIndex, endIndex));
  }, [data, page]);

  return (
    <SecondaryCard className="space-y-4">
      <PromptContent
        content={
          "I'm a delegator and my delegatees can submit extrinsics on behalf of me."
        }
      />
      <MapDataList
        loading={loading}
        noDataText="No proxy set"
        columnsDef={columns}
        data={dataList}
      />
      {pageComponent}
    </SecondaryCard>
  );
}
