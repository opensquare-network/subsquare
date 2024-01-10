import useProfileReferendaDepositsData from "next-common/components/profile/deposits/referenda";
import { useChainSettings } from "next-common/context/chain";
import DepositTemplate from "next-common/components/myDeposits/depositTemplate";
import partition from "lodash.partition";
import useProfileFellowshipDepositsData from "next-common/components/profile/deposits/fellowship";
import useProfileDemocracyDepositsData from "next-common/components/profile/deposits/democracy";
import useProfileTreasuryDepositsData from "next-common/components/profile/deposits/treasury";
import { useSelector } from "react-redux";
import { profilePreimageDepositsSelector } from "next-common/store/reducers/profile/deposits/preimage";
import MyDepositPreimages from "next-common/components/myDeposits/preimages";

export default function ProfileDeposits() {
  const chainSettings = useChainSettings();
  const { hasReferenda, hasFellowship, noDemocracyModule, hasTreasuryModule } =
    chainSettings;

  const referenda = useProfileReferendaDepositsData();
  const fellowship = useProfileFellowshipDepositsData();
  const democracy = useProfileDemocracyDepositsData();
  const treasury = useProfileTreasuryDepositsData();

  const preimageDeposits = useSelector(profilePreimageDepositsSelector);

  const sections = [
    hasReferenda && {
      activeCount: referenda.activeCount,
      content: <DepositTemplate key="referenda" {...referenda} />,
    },
    hasFellowship && {
      activeCount: fellowship.activeCount,
      content: <DepositTemplate key="fellowship" {...fellowship} />,
    },
    !noDemocracyModule && {
      activeCount: democracy.activeCount,
      content: <DepositTemplate key="democracy" {...democracy} />,
    },
    hasTreasuryModule !== false && {
      activeCount: treasury.activeCount,
      content: <DepositTemplate key="treasury" {...treasury} />,
    },
    {
      activeCount: preimageDeposits?.length || 0,
      content: (
        <MyDepositPreimages key="preimages" deposits={preimageDeposits} />
      ),
    },
  ].filter(Boolean);

  const [activeSections, nonActiveSections] = partition(
    sections,
    (section) => section.activeCount > 0,
  );

  return (
    <div className="space-y-6">
      {activeSections.map((section) => section.content)}
      {nonActiveSections.map((section) => section.content)}
    </div>
  );
}
