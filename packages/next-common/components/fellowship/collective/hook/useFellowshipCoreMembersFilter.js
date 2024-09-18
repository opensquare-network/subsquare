import { isNil } from "lodash-es";
import { useMemo } from "react";
import useFellowshipCoreOnlySwitch from "./useFellowshipCoreOnlySwitch";
import useSubCoreCollectivesMember from "next-common/hooks/collectives/useSubCoreCollectivesMember";

function isFellowshipCoreOnly(item) {
  const { member: memberStatus, isLoading } = useSubCoreCollectivesMember(
    item.address,
  );
  return !isNil(memberStatus) && !isLoading;
}

function handleFilterMembers(members) {
  return members.map((item) => {
    return {
      ...item,
      isFellowshipOnly: isFellowshipCoreOnly(item),
    };
  });
}

export default function useFellowshipCoreMembersFilter(members) {
  const { isOn: isFellowshipCoreOnly, component: FellowshipCoreSwitch } =
    useFellowshipCoreOnlySwitch();
  const membersWithStatus = handleFilterMembers(members);

  const filteredMembers = useMemo(() => {
    if (isNil(membersWithStatus)) return;

    let filteredMembers = membersWithStatus;

    if (isFellowshipCoreOnly) {
      filteredMembers = filteredMembers.filter((member) => {
        return member.isFellowshipOnly;
      });
    }
    return filteredMembers;
  }, [membersWithStatus, isFellowshipCoreOnly]);

  return {
    filteredMembers,
    component: FellowshipCoreSwitch,
  };
}
