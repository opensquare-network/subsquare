import useProfileReferendaDepositsData from "next-common/components/profile/deposits/referenda";
import { useChainSettings } from "next-common/context/chain";
import DepositTemplate from "next-common/components/myDeposits/depositTemplate";
import partition from "lodash.partition";

export default function ProfileDeposits() {
  const chainSettings = useChainSettings();
  const { hasReferenda } = chainSettings;

  const referenda = useProfileReferendaDepositsData();
  const sections = [
    hasReferenda && {
      activeCount: referenda.activeCount,
      content: <DepositTemplate key="referenda" {...referenda} />,
    },
  ];

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
