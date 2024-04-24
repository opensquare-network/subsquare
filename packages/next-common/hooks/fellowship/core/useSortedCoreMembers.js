import { useSelector } from "react-redux";
import { fellowshipCoreMembersSelector } from "next-common/store/reducers/fellowship/core";
import { useMemo } from "react";
import { isNil, orderBy } from "lodash-es";

export default function useSortedCoreMembers() {
  const members = useSelector(fellowshipCoreMembersSelector);

  return useMemo(() => {
    if (isNil(members)) {
      return members;
    }

    return orderBy(members, ["rank"], ["desc"]);
  }, [members]);
}
