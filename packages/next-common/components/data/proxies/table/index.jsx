import { TreeMapDataList } from "next-common/components/dataList";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import TableColumns from "./columns";
import { useAllProxiesContext } from "next-common/components/data/context/allProxies";

function TableHeader() {
  const { total, loading } = useAllProxiesContext();

  return (
    <div>
      <TitleContainer>
        <span>
          List
          <span className="text-textTertiary text14Medium ml-1">
            {!loading && total}
          </span>
        </span>
        {/* TODO: filter by current address */}
      </TitleContainer>
      {/* TODO: filter by identity name or address */}
    </div>
  );
}

export default function ProxyExplorerTable() {
  const { data, loading } = useAllProxiesContext();

  return (
    <div className="flex flex-col gap-y-4">
      <TableHeader />
      <TreeMapDataList
        bordered
        columnsDef={TableColumns}
        noDataText="No Data"
        data={data}
        loading={loading}
        treeKey="items"
        tree={true}
      />
    </div>
  );
}
