import { find } from "lodash-es";
import { fellowshipCoreMembersSelector } from "next-common/store/reducers/fellowship/core";
import { useSelector } from "react-redux";
import useFetchFellowshipCoreMembers from "./useFetchFellowshipCoreMembers";

export function useIsFellowshipCoreMember(address) {
  useFetchFellowshipCoreMembers();
  const members = useSelector(fellowshipCoreMembersSelector);
  const member = find(members, { address });

  return !!member;
}
