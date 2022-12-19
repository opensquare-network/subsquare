import { makeLinearCurve, makeReciprocalCurve } from "./generator";
import { useTrack } from "../track";

function common(track, filed) {
  const curve = track[filed];
  if (!curve) {
    return null;
  }

  if (curve.reciprocal) {
    const { factor, xOffset, yOffset } = curve.reciprocal;
    return makeReciprocalCurve(factor, xOffset, yOffset);
  }

  if (curve.linearDecreasing) {
    const { length, floor, ceil } = curve.linearDecreasing;
    return makeLinearCurve(length, floor, ceil);
  }

  return null;
}

export function useApprovalCurve() {
  const track = useTrack();
  return getTrackApprovalCurve(track);
}

export function useSupportCurve() {
  const track = useTrack();
  return getTrackSupportCurve(track);
}

export function getTrackApprovalCurve(track) {
  return common(track, "minApproval");
}

export function getTrackSupportCurve(track) {
  return common(track, "minSupport");
}
