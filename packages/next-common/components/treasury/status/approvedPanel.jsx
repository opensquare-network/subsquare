import SummaryLayout from "next-common/components/summary/layout/layout";
import ApprovedProposal from "./summarys/approvedProposal";
import ApprovedSpend from "./summarys/approvedSpend";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import SpendPeriod from "./summarys/spendPeriod";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

export default function ApprovedPanel() {
  return (
    <>
      <TitleContainer className="justify-start">
        <span>Approved</span>
      </TitleContainer>
      <NeutralPanel className="p-6 space-y-4">
        <SummaryLayout>
          <ApprovedSpend />
          <ApprovedProposal />
          <SpendPeriod />
        </SummaryLayout>
      </NeutralPanel>
    </>
  );
}
