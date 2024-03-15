import {
  Democracy,
  useModuleTab,
} from "next-common/components/profile/votingHistory/common";
import { Referenda } from "next-common/components/profile/votingHistory/common";
import ReferendaDelegates from "next-common/components/delegation/delegate/referenda";
import DemocracyDelegates from "./democracy";

export default function DelegatesSection() {
  const tab = useModuleTab();

  if (tab === Referenda) {
    return <ReferendaDelegates />;
  } else if (tab === Democracy) {
    return <DemocracyDelegates />;
  }

  return null;
}
