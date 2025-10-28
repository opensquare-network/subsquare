import SummaryLayout from "next-common/components/summary/layout/layout";
import ApprovedProposal from "./summarys/approvedProposal";
import ApprovedSpend from "./summarys/approvedSpend";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";

export default function ApprovedPanel() {
  return (
    <NeutralPanel className="p-6 space-y-4">
      <SummaryLayout>
        <ApprovedSpend />
        <ApprovedProposal />
      </SummaryLayout>
    </NeutralPanel>
  );
}
