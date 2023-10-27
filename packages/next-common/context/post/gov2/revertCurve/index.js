import {
  makeRevertLinearFunc,
  makeRevertReciprocalFunc,
} from "next-common/context/post/gov2/revertCurve/generator";
import { useTrack } from "next-common/context/post/gov2/track";

function common(track, filed) {
  const curve = track[filed];
  if (!curve) {
    return null;
  }

  if (curve.reciprocal) {
    const { factor, xOffset, yOffset } = curve.reciprocal;
    return makeRevertReciprocalFunc(factor, xOffset, yOffset);
  }

  if (curve.linearDecreasing) {
    const { length, floor, ceil } = curve.linearDecreasing;
    return makeRevertLinearFunc(length, floor, ceil);
  }

  return null;
}

export function getTrackApprovalCurve(track) {
  return common(track, "minApproval");
}

export function getTrackSupportCurve(track) {
  return common(track, "minSupport");
}

export function useRevertApprovalCurveFunc() {
  const track = useTrack();
  return getTrackApprovalCurve(track);
}

export function useRevertSupportCurveFunc() {
  const track = useTrack();
  return getTrackSupportCurve(track);
}
