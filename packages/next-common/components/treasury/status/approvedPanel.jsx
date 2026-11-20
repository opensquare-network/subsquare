import SummaryLayout from "next-common/components/summary/layout/layout";
import ApprovedProposal from "./summarys/approvedProposal";
import ApprovedSpend from "./summarys/approvedSpend";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import { SpendPeriodWithPapi } from "./summarys/spendPeriod";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useChainSettings } from "next-common/context/chain";
import { hasTreasuryApprovals } from "next-common/utils/treasury/approvals";

export default function ApprovedPanel() {
  const settings = useChainSettings();
  const hasApprovals = hasTreasuryApprovals(settings);

  return (
    <>
      <TitleContainer className="justify-start">
        <span>To be awarded</span>
      </TitleContainer>
      <NeutralPanel className="p-6 space-y-4">
        <SummaryLayout>
          <ApprovedSpend />
          {hasApprovals && <ApprovedProposal />}
          <SpendPeriodWithPapi />
        </SummaryLayout>
      </NeutralPanel>
    </>
  );
}
