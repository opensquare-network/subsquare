import DataList from "next-common/components/dataList";
import { isNil } from "lodash-es";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import ProxyExplorerTableColumns from "./columns"

export default function ProxyExplorerTable() {
  const data = [];
  const isLoading = isNil(data);

  return (
    <div className="flex flex-col gap-y-4">
      <TitleContainer>
        <span>
          List
          <span className="text-textTertiary text14Medium ml-1">0</span>
        </span>
        {/* TODO: filter by current address */}
      </TitleContainer>
      {/* TODO: filter by identity name or address */}

      <DataList
        bordered
        columns={ProxyExplorerTableColumns}
        noDataText="No Data"
        rows={[]}
        loading={isLoading}
      />
    </div>
  );
}
