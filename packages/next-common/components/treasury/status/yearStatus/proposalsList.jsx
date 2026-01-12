import normalizeTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeProposalListItem";
import TreasuryItemsList from "./treasuryItemsList";

export default function ProposalsList({ proposals = [] }) {
  return (
    <TreasuryItemsList
      items={proposals}
      getIndex={(item) => item.proposalIndex}
      apiPath="/treasury/proposals"
      normalizeItem={normalizeTreasuryProposalListItem}
    />
  );
}
