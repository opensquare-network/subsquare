import { MapDataList } from "next-common/components/dataList";
import { useEffect, useState } from "react";
import {
  delegateeColumn,
  typeColumn,
  useDelayBlockOrTimeColumn,
} from "./common/columns";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useMyProxiesContext } from "./context/myProxies";
import HeaderPrompt from "./common/headerPrompt";

export default function MyProxies() {
  const { data, loading } = useMyProxiesContext();
  const [dataList, setDataList] = useState([]);

  const delayBlockOrTimeColumn = useDelayBlockOrTimeColumn();
  const columns = [delegateeColumn, typeColumn, delayBlockOrTimeColumn];

  useEffect(() => {
    if (loading) {
      return;
    }

    setDataList(data);
  }, [data, loading]);

  return (
    <SecondaryCard className="space-y-4">
      <HeaderPrompt
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
    </SecondaryCard>
  );
}
