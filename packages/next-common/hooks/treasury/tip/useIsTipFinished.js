import { usePostState } from "next-common/context/post";

export default function useIsTipFinished() {
  const state = usePostState();
  return [
    "Removed",
    "Retracted",
    "Closed",
    "TipSlashed",
    "TipRetracted",
    "TipClosed",
  ].includes(state);
}
