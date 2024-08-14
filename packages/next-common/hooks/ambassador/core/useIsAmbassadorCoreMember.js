import { find } from "lodash-es";
import { ambassadorCoreMembersSelector } from "next-common/store/reducers/ambassador/core";
import { useSelector } from "react-redux";
import useFetchAmbassadorCoreMembers from "./useFetchAmbassadorCoreMembers";

export function useIsAmbassadorCoreMember(address) {
  useFetchAmbassadorCoreMembers();
  const members = useSelector(ambassadorCoreMembersSelector);
  const member = find(members, { address });

  return !!member;
}
