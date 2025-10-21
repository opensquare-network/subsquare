import useFetchProfileReferendaDeposits from "next-common/hooks/profile/deposit/useFetchProfileReferendaDeposits";
import useFetchProfileFellowshipDeposits from "next-common/hooks/profile/deposit/useFetchProfileFellowshipDeposits";
import useFetchProfileDemocracyDeposits from "next-common/hooks/profile/deposit/useFetchProfileDemocracyDeposits";
import useFetchProfileTreasuryDeposits from "next-common/hooks/profile/deposit/treasury";
import useFetchProfilePreimageDeposits from "next-common/hooks/profile/deposit/useFetchProfilePreimageDeposits";
import useSubProfileIdentityDeposits from "next-common/hooks/profile/deposit/useFetchProfileIdentityDeposits";
import { useProfileProxyDepositsData } from "next-common/components/profile/deposits/proxy";

export default function useFetchProfileDepositsData() {
  useFetchProfileReferendaDeposits();
  useFetchProfileFellowshipDeposits();
  useFetchProfileDemocracyDeposits();
  useFetchProfileTreasuryDeposits();
  useSubProfileIdentityDeposits();
  useFetchProfilePreimageDeposits();
  useProfileProxyDepositsData();
}
