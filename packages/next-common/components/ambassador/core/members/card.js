import useSubCoreCollectivesMember from "next-common/hooks/collectives/useSubCoreCollectivesMember";
import React, { useMemo } from "react";
import CoreFellowshipMemberCard from "next-common/components/collectives/core/member/card";
import Actions from "./actions";
import NonCoreFellowshipMemberCard from "next-common/components/fellowship/core/members/nonCoreCard";

function AmbassadorCoreMemberCard({ member: _member = {}, params = {} }) {
  const pallet = "ambassadorCore";
  const { member: statusFromStorage } = useSubCoreCollectivesMember(
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
      <Actions member={member} params={params} />
    </CoreFellowshipMemberCard>
  );
}

export default function AmbassadorMemberCard({
  member = {},
  params = {},
  isCandidate,
}) {
  const { isFellowshipCoreMember } = member;
  if (!isCandidate && !isFellowshipCoreMember) {
    return <NonCoreFellowshipMemberCard member={member} />;
  }

  return <AmbassadorCoreMemberCard member={member} params={params} />;
}
