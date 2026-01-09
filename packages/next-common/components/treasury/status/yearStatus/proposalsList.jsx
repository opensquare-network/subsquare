import { proposalColumnsDef } from "../../projects/projectDetailPopup/columns";
import normalizeTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeProposalListItem";
import { normalizeProposals } from "../../projects/hooks/usePopupDetailTabs";
import TreasuryItemsList from "./treasuryItemsList";

export default function ProposalsList({ proposals = [] }) {
  return (
    <TreasuryItemsList
      items={proposals}
      getIndex={(proposal) => proposal.proposalIndex}
      apiPath="/treasury/proposals"
      normalizeItem={normalizeTreasuryProposalListItem}
      normalize={normalizeProposals}
      columnsDef={proposalColumnsDef}
    />
  );
}
