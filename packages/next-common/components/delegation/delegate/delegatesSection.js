import { useModuleTab } from "next-common/components/profile/votingHistory/common";
import { Referenda } from "next-common/components/profile/votingHistory/common";
import ReferendaDelegates from "next-common/components/delegation/delegate/referenda";

export default function DelegatesSection() {
  const tab = useModuleTab();

  if (tab === Referenda) {
    return <ReferendaDelegates />;
  }

  return null;
}
