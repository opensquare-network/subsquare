import useFetchMyTreasuryProposalDeposits from "./useFetchMyTreasuryProposalDeposits";
import useFetchMyTreasuryBountyDeposits from "next-common/hooks/account/deposit/useFetchMyTreasuryDeposits/useFetchMyTreasuryBountyDeposits";

export default function useFetchMyTreasuryDeposits() {
  useFetchMyTreasuryProposalDeposits();
  useFetchMyTreasuryBountyDeposits();
}
