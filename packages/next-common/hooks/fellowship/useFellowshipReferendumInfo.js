import { useReferendumInfo } from "next-common/hooks/referenda/useReferendumInfo";

export function useFellowshipReferendumTally() {
  const info = useReferendumInfo();
  return info?.tally;
}
