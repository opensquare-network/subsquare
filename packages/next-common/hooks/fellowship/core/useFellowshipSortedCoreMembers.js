import { isNil, orderBy } from "lodash-es";
import { useMemo } from "react";
import useFellowshipCoreMembersWithRank from "./useFellowshipCoreMembersWithRank";

export default function useFellowshipSortedCoreMembers() {
  const { members } = useFellowshipCoreMembersWithRank();

  return useMemo(() => {
    if (isNil(members)) {
      return members;
    }

    return orderBy(members, ["rank"], ["desc"]);
  }, [members]);
}
