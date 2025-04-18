import useSubStorage from "../common/useSubStorage";
import { useReferendaFellowshipPallet } from "next-common/context/collectives/collectives";

export default function useSubFellowshipReferendum(referendumIndex) {
  const referendaPallet = useReferendaFellowshipPallet();
  return useSubStorage(referendaPallet, "referendumInfoFor", [referendumIndex]);
}
