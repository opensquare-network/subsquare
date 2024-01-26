import NotNil from "next-common/components/common/NotNil";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipCoreMemberCard from "next-common/components/fellowship/core/members/card";
import FellowshipCoreMemberCardListContainer from "./listContainer";

export default function MyFellowshipMemberStatus({ member }) {
  return (
    <NotNil value={member}>
      <TitleContainer>
        <span>My Status</span>
      </TitleContainer>

      <FellowshipCoreMemberCardListContainer>
        <FellowshipCoreMemberCard member={member} />
      </FellowshipCoreMemberCardListContainer>
    </NotNil>
  );
}
