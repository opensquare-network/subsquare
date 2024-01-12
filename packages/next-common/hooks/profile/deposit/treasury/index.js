import useFetchProfileTreasuryProposalDeposits from "next-common/hooks/profile/deposit/treasury/proposal";
import useFetchProfileTreasuryBountyDeposits from "next-common/hooks/profile/deposit/treasury/bounty";
import useFetchProfileTreasuryTipDeposits from "next-common/hooks/profile/deposit/treasury/tip";

export default function useFetchProfileTreasuryDeposits() {
  useFetchProfileTreasuryProposalDeposits();
  useFetchProfileTreasuryBountyDeposits();
  useFetchProfileTreasuryTipDeposits();
}
