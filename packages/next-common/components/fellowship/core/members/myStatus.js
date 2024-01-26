import NotNil from "next-common/components/common/NotNil";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipCoreMemberCard from "next-common/components/fellowship/core/members/card";

export default function MyFellowshipMemberStatus({ member }) {
  return (
    <NotNil value={member}>
      <div className="flex flex-col gap-y-4 mb-6">
        <TitleContainer>
          <span>My Status</span>
        </TitleContainer>
        <FellowshipCoreMemberCard member={member} />
      </div>
    </NotNil>
  );
}
