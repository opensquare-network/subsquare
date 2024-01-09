import useProfileReferendaDepositsData from "next-common/components/profile/deposits/referenda";
import { useChainSettings } from "next-common/context/chain";
import DepositTemplate from "next-common/components/myDeposits/depositTemplate";
import partition from "lodash.partition";
import useProfileFellowshipDepositsData from "next-common/components/profile/deposits/fellowship";

export default function ProfileDeposits() {
  const chainSettings = useChainSettings();
  const { hasReferenda, hasFellowship } = chainSettings;

  const referenda = useProfileReferendaDepositsData();
  const fellowship = useProfileFellowshipDepositsData();
  const sections = [
    hasReferenda && {
      activeCount: referenda.activeCount,
      content: <DepositTemplate key="referenda" {...referenda} />,
    },
    hasFellowship && {
      activeCount: fellowship.activeCount,
      content: <DepositTemplate key="fellowship" {...fellowship} />,
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
