import { isNil, orderBy } from "lodash-es";
import { useMemo } from "react";
import useFellowshipCoreMembers from "./useFellowshipCoreMembers";

export default function useSortedCoreMembers() {
  const { members } = useFellowshipCoreMembers();

  return useMemo(() => {
    if (isNil(members)) {
      return members;
    }

    return orderBy(members, ["rank"], ["desc"]);
  }, [members]);
}
