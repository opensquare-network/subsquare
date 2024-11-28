import useProfileReferendaDepositsData from "next-common/components/profile/deposits/referenda";
import useProfileFellowshipDepositsData from "next-common/components/profile/deposits/fellowship";
import useProfileDemocracyDepositsData from "next-common/components/profile/deposits/democracy";
import useProfileTreasuryDepositsData from "next-common/components/profile/deposits/treasury";
import { useSelector } from "react-redux";
import { profilePreimageDepositsSelector } from "next-common/store/reducers/profile/deposits/preimage";
import useProfileIdentityDepositsData from "next-common/components/profile/deposits/identity";
import { useDepositSections } from "next-common/components/myDeposits";

export default function ProfileDeposits() {
  const referenda = useProfileReferendaDepositsData();
  const fellowship = useProfileFellowshipDepositsData();
  const democracy = useProfileDemocracyDepositsData();
  const treasury = useProfileTreasuryDepositsData();
  const identity = useProfileIdentityDepositsData();
  const preimageDeposits = useSelector(profilePreimageDepositsSelector);
  // TODO: get deposits proxy data
  const proxyDeposits = [{}, {}];

  // TODO: show proxy only profile
  const [activeSections, nonActiveSections] = useDepositSections(
    referenda,
    fellowship,
    democracy,
    treasury,
    identity,
    preimageDeposits,
    proxyDeposits,
  );

  return (
    <div className="space-y-6">
      {activeSections.map((section) => section.content)}
      {nonActiveSections.map((section) => section.content)}
    </div>
  );
}
