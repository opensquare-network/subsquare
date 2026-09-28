import ListLayout from "next-common/components/layout/ListLayout";
import DapSummary from "./summary";
import DapAllocation from "./allocation";
import DapProvider from "./context";

export default function DapPageContent() {
  return (
    <DapProvider>
      <ListLayout
        title="Dynamic Allocation Pool"
        description="Current on-chain supply and allocation"
        summary={<DapSummary />}
      >
        <DapAllocation />
      </ListLayout>
    </DapProvider>
  );
}
