import { useSelector } from "react-redux";
import { ambassadorCoreMembersSelector } from "next-common/store/reducers/ambassador/core";
import { useMemo } from "react";
import { isNil, orderBy } from "lodash-es";

export default function useAmbassadorCoreSortedMembers() {
  const members = useSelector(ambassadorCoreMembersSelector);

  return useMemo(() => {
    if (isNil(members)) {
      return members;
    }

    return orderBy(members, ["rank"], ["desc"]);
  }, [members]);
}
