import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useCollectiveMember from "../../../hooks/useCollectiveMember";

export default function useMyRank() {
  const realAddress = useRealAddress();
  const me = useCollectiveMember(realAddress);
  return me?.rank;
}
