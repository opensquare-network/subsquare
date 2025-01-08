import React from "react";
import Actions from "next-common/components/fellowship/core/members/actions";
import CoreFellowshipMemberCard from "next-common/components/collectives/core/member/card";
import NonCoreFellowshipMemberCard from "./nonCoreCard";

export default function FellowshipCoreMemberCard({
  isCandidate = true,
  member = {},
  params = {},
}) {
  const { isFellowshipCoreMember } = member;
  if (!isCandidate && !isFellowshipCoreMember) {
    return <NonCoreFellowshipMemberCard member={member} />;
  }

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
