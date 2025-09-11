import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import SalesHistoryTable from "./table";

export default function CoretimeSalesHistory() {
  return (
    <div>
      <TitleContainer className="mb-4">History</TitleContainer>
      <NeutralPanel className="p-6">
        <SalesHistoryTable />
      </NeutralPanel>
    </div>
  );
}
