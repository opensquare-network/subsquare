import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMemo } from "react";

export default function useMembersWithMeAtFirst(members) {
  const realAddress = useRealAddress();

  return useMemo(() => {
    const newMembersArray = members || [];
    // Move my member to the first, keep the order of other members
    newMembersArray.sort((a, b) => {
      if (a.address === realAddress) {
        return -1;
      } else if (b.address === realAddress) {
        return 1;
      } else {
        return 0;
      }
    });
    return newMembersArray;
  }, [members, realAddress]);
}
