import useDemocracyTally from "../../context/post/democracy/referendum/tally";
import { useSelector } from "react-redux";
import { referendumStatusSelector } from "next-common/store/reducers/referendumSlice";

export default function useLatestDemocracyTally() {
  const contextTally = useDemocracyTally();
  const referendumStatus = useSelector(referendumStatusSelector);
  return referendumStatus?.tally || contextTally;
}
