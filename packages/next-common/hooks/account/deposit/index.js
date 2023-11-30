import useFetchMyReferendaDeposits from "./referenda";
import useFetchMyDemocracyDeposits from "./useFetchMyDemocracyDeposits";
import useFetchMyFellowshipDeposits from "./useFetchMyFellowshipDeposits";
import useFetchMyPreimageDeposits from "./useFetchMyPreimageDeposits";
import useFetchMyTreasuryDeposits from "./useFetchMyTreasuryDeposits";

export function useFetchMyDepositsData() {
  useFetchMyReferendaDeposits();
  useFetchMyFellowshipDeposits();
  useFetchMyDemocracyDeposits();
  useFetchMyTreasuryDeposits();
  useFetchMyPreimageDeposits();
}
