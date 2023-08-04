import {
  Democracy,
  ModuleTabProvider,
  Referenda,
} from "next-common/components/profile/votingHistory/common";
import { useChainSettings } from "next-common/context/chain";
import ModuleVotes from "./moduleVotes";

export default function MyVotes() {
  const { hasReferenda } = useChainSettings();
  const defaultTab = hasReferenda ? Referenda : Democracy;

  return (
    <ModuleTabProvider defaultTab={defaultTab}>
      <ModuleVotes />
    </ModuleTabProvider>
  );
}
