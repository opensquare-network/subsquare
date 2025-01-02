import FellowshipCoreMemberCardListContainer from "next-common/components/fellowship/core/members/listContainer";
import FellowshipCoreMemberCard from "next-common/components/fellowship/core/members/card";
import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";

export default function FellowshipMemberCardView({ members }) {
  const params = useCoreFellowshipParams();

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
