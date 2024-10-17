import DataList from "../dataList";
import { NeutralPanel } from "../styled/containers/neutralPanel";
import { TitleContainer } from "../styled/containers/titleContainer";

export default function CoretimeSalesHistorySection() {
  return (
    <div>
      <TitleContainer className="mb-4">Sales History</TitleContainer>
      <NeutralPanel className="p-6">
        <DataList
          noDataText="No sales history"
          columns={[
            { name: "Extrinsic ID" },
            { name: "Core" },
            { name: "Purchased By" },
            { name: "Type" },
            { name: "Time" },
            { name: "Price", className: "text-right" },
          ]}
        />
      </NeutralPanel>
    </div>
  );
}
