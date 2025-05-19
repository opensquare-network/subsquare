import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useMemberRank from "./useMemberRank";

export default function useMyRank() {
  const realAddress = useRealAddress();
  return useMemberRank(realAddress);
}
