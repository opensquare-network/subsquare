// TODO: rename to ReferendaTrackSummaryFooter
import Delegation from "./delegation";
import BeenDelegated from "./beenDelegated";

/**
 * @alias ReferendaTrackSummaryFooter
 */
export default function Gov2TrackSummaryFooter({ period }) {
  const { id } = period ?? {};

  return (
    <div className="flex flex-col gap-y-2">
      <Delegation trackId={id} />
      <BeenDelegated trackId={id} />
    </div>
  );
}
