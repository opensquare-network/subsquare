import {
  Democracy,
  Referenda,
  useModuleTab,
} from "next-common/components/profile/votingHistory/common";
import ReferendaAnnouncement from "./referenda";
import DemocracyAnnouncement from "./democracy";

export default function PublicAnnouncement() {
  const moduleTab = useModuleTab();

  if (moduleTab === Referenda) {
    return <ReferendaAnnouncement />;
  } else if (moduleTab === Democracy) {
    return <DemocracyAnnouncement />;
  }

  return null;
}
