import useConfirmingReferendaCount from "./useConfirmingReferendaCount";
import { useChainSettings } from "next-common/context/chain";
import usePromptVisibility from "next-common/hooks/usePromptVisibility";
import RequestingPrompt from "./requestingPrompt";

const STORAGE_KEY = "confirming-referenda-stats-closed";

function ConfirmingReferendaStatsPrompt() {
  const { value, loading } = useConfirmingReferendaCount();
  const shouldShow = !loading && value > 0;
  const { visible, handleClose } = usePromptVisibility(STORAGE_KEY, shouldShow);

  if (!visible) {
    return null;
  }

  return <RequestingPrompt confirmingCount={value} onClose={handleClose} />;
}

export default function ConfirmingReferendaStats() {
  const { modules } = useChainSettings();
  if (!modules?.referenda) {
    return null;
  }

  return <ConfirmingReferendaStatsPrompt />;
}
