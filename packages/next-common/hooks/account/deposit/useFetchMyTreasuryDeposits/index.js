import useFetchMyTreasuryProposalDeposits from "./useFetchMyTreasuryProposalDeposits";
import useFetchMyTreasuryBountyDeposits from "./useFetchMyTreasuryBountyDeposits";
import useFetchMyTreasuryTipDeposits from "./useFetchMyTreasuryTipDeposits";

export default function useFetchMyTreasuryDeposits() {
  useFetchMyTreasuryProposalDeposits();
  useFetchMyTreasuryBountyDeposits();
  useFetchMyTreasuryTipDeposits();
}
