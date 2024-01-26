import { usePageProps } from "next-common/context/page";
import useFetchFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFetchFellowshipCoreMembers";
import { useSelector } from "react-redux";
import { fellowshipCoreMembersSelector } from "next-common/store/reducers/fellowship/core";
import { useMemo } from "react";
import FellowshipMembersLoadable from "next-common/components/pages/fellowship/loadable";
import FellowshipMemberCommon from "next-common/components/pages/fellowship/common";
import FellowshipMemberTabs from "next-common/components/fellowship/core/members/tabs";
import FellowshipCoreMemberCardListContainer from "next-common/components/fellowship/core/members/listContainer";
import FellowshipCoreMemberCard from "next-common/components/fellowship/core/members/card";

export default function FellowshipCandidatesPage() {
  const { fellowshipMembers } = usePageProps();
  useFetchFellowshipCoreMembers(fellowshipMembers);
  const members = useSelector(fellowshipCoreMembersSelector);
  const pageMembers = useMemo(
    () => (members || []).filter((member) => member.rank <= 0),
    [members],
  );

  return (
    <FellowshipMembersLoadable>
      <FellowshipMemberCommon>
        <div className="mb-4 pr-6 leading-8">
          <FellowshipMemberTabs members={members} />
        </div>

        <FellowshipCoreMemberCardListContainer>
          {pageMembers.map((member) => (
            <FellowshipCoreMemberCard key={member.address} member={member} />
          ))}
        </FellowshipCoreMemberCardListContainer>
      </FellowshipMemberCommon>
    </FellowshipMembersLoadable>
  );
}
