import { usePostState } from "next-common/context/post";

export default function useIsDemocracyExternalFinished() {
  const state = usePostState();
  return ["Tabled"].includes(state);
}
