import useSubCoreFellowshipMember from "next-common/hooks/collectives/useSubCoreFellowshipMember";
import { useMemo } from "react";
import CoreFellowshipMemberCard from "next-common/components/collectives/core/member/card";

export default function AmbassadorCoreMemberCard({
  member: _member = {},
  params = {},
}) {
  const { member: statusFromStorage } = useSubCoreFellowshipMember(
    _member.address,
    "ambassadorCore",
  );
  const member = useMemo(() => {
    return {
      ..._member,
      status: statusFromStorage || _member.status || {},
    };
  }, [_member, statusFromStorage]);

  return <CoreFellowshipMemberCard member={member} params={params} />;
}
