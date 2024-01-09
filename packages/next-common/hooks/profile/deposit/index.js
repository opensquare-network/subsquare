import useFetchProfileReferendaDeposits from "next-common/hooks/profile/deposit/useFetchProfileReferendaDeposits";
import useFetchProfileFellowshipDeposits from "next-common/hooks/profile/deposit/useFetchProfileFellowshipDeposits";
import useFetchProfileDemocracyDeposits from "next-common/hooks/profile/deposit/useFetchProfileDemocracyDeposits";
import useFetchProfileTreasuryDeposits from "next-common/hooks/profile/deposit/treasury";

export default function useFetchProfileDepositsData() {
  useFetchProfileReferendaDeposits();
  useFetchProfileFellowshipDeposits();
  useFetchProfileDemocracyDeposits();
  useFetchProfileTreasuryDeposits();
}
