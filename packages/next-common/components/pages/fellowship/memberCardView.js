import FellowshipCoreMemberCardListContainer from "next-common/components/fellowship/core/members/listContainer";
import FellowshipCoreMemberCard from "next-common/components/fellowship/core/members/card";
import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";
import { useEffect, useState } from "react";
import { SystemLoading } from "@osn/icons/subsquare";

export default function FellowshipMemberCardView({
  members: _members,
  isLoading: _isLoading,
}) {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMembers(_members);
    setIsLoading(_isLoading);
  }, [_members, _isLoading]);

  const params = useCoreFellowshipParams();

  if (isLoading) {
    return (
      <SystemLoading className="my-6 [&_path]:stroke-textTertiary mx-auto" />
    );
  }

  return (
    <FellowshipCoreMemberCardListContainer>
      {members.map((member) => (
        <FellowshipCoreMemberCard
          key={member.address}
          member={member}
          params={params}
        />
      ))}
    </FellowshipCoreMemberCardListContainer>
  );
}
