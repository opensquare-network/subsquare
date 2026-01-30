import useMyJudgementRequest from "./useMyJudgementRequest";

export default function useHasActiveJudgementRequest() {
  const { value } = useMyJudgementRequest();
  return !!value;
}
