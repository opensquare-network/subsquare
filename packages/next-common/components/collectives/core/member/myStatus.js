import NotNil from "next-common/components/common/NotNil";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipCoreMemberCardListContainer from "next-common/components/fellowship/core/members/listContainer";
import AmbassadorCoreMemberCard from "next-common/components/ambassador/core/members/card";

export default function MyAmbassadorMemberStatus({ member, params = {} }) {
  return (
    <NotNil value={member}>
      <div className="mb-6">
        <TitleContainer className="mb-4">
          <span>My Status</span>
        </TitleContainer>

        <FellowshipCoreMemberCardListContainer>
          <AmbassadorCoreMemberCard member={member} params={params} />
        </FellowshipCoreMemberCardListContainer>
      </div>
    </NotNil>
  );
}
