import { makeLinearCurve, makeReciprocalCurve } from "./generator";
import { useTrack } from "../track";

function common(track, filed) {
  const curve = track[filed];
  if (!curve) {
    return null;
  }

  if (curve.reciprocal) {
    const { factor, xOffset, yOffset } = track.minApproval.reciprocal;
    return makeReciprocalCurve(factor, xOffset, yOffset);
  }

  if (curve.linearDecreasing) {
    const { length, floor, ceil } = track.minApproval.linearDecreasing;
    return makeLinearCurve(length, floor, ceil);
  }

  return null;
}

export function useApprovalCurve() {
  const track = useTrack();
  return common(track, "minApproval");
}

export function useSupportCurve() {
  const track = useTrack();
  return common(track, "minSupport");
}
