import React, { useMemo } from "react";
import Actions from "next-common/components/fellowship/core/members/actions";
import useSubFellowshipCoreMember from "next-common/hooks/fellowship/core/useSubFellowshipCoreMember";
import CoreFellowshipMemberCard from "next-common/components/collectives/core/member/card";

export default function FellowshipCoreMemberCard({
  member: _member = {},
  params = {},
}) {
  const { member: statusFromStorage } = useSubFellowshipCoreMember(
    _member.address,
  );

  const member = useMemo(() => {
    return {
      ..._member,
      status: statusFromStorage || _member.status || {},
    };
  }, [_member, statusFromStorage]);

  return (
    <CoreFellowshipMemberCard
      member={member}
      params={params}
      pallet="fellowshipCore"
    >
      <Actions member={member} />
    </CoreFellowshipMemberCard>
  );
}
