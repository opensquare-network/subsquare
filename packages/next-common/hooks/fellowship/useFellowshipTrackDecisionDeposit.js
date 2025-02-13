import { useContextApi } from "next-common/context/api";
import { useReferendaFellowshipPallet } from "next-common/context/collectives/collectives";
import { find } from "lodash-es";

export function useFellowshipTrackDecisionDeposit(trackId) {
  const api = useContextApi();
  const pallet = useReferendaFellowshipPallet();

  if (!api) {
    return 0;
  }

  const tracks = api.consts[pallet].tracks.toJSON();
  const track = find(tracks, (track) => track[0] === trackId);

  if (!track) {
    return 0;
  }

  return track[1].decisionDeposit.toString();
}
