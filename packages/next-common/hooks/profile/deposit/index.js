import useFetchProfileReferendaDeposits from "next-common/hooks/profile/deposit/useFetchProfileReferendaDeposits";
import useFetchProfileFellowshipDeposits from "next-common/hooks/profile/deposit/useFetchProfileFellowshipDeposits";

export default function useFetchProfileDepositsData() {
  useFetchProfileReferendaDeposits();
  useFetchProfileFellowshipDeposits();
}
