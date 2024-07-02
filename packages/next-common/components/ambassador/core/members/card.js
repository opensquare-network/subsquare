import useSubCoreFellowshipMember from "next-common/hooks/collectives/useSubCoreFellowshipMember";
import React, { useMemo } from "react";
import CoreFellowshipMemberCard from "next-common/components/collectives/core/member/card";
import Actions from "./actions";

export default function AmbassadorCoreMemberCard({
  member: _member = {},
  params = {},
}) {
  const pallet = "ambassadorCore";
  const { member: statusFromStorage } = useSubCoreFellowshipMember(
    _member.address,
    pallet,
  );
  const member = useMemo(() => {
    return {
      ..._member,
      status: statusFromStorage || _member.status || {},
    };
  }, [_member, statusFromStorage]);

  return (
    <CoreFellowshipMemberCard member={member} params={params} pallet={pallet}>
      <Actions member={member} />
    </CoreFellowshipMemberCard>
  );
}
