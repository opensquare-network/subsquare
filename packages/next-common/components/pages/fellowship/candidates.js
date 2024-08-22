import { useMemo } from "react";
import FellowshipMembersLoadable from "next-common/components/pages/fellowship/loadable";
import FellowshipMemberCommon from "next-common/components/pages/fellowship/common";
import FellowshipMemberTabs from "next-common/components/fellowship/core/members/tabs";
import FellowshipCoreMemberCardListContainer from "next-common/components/fellowship/core/members/listContainer";
import FellowshipCoreMemberCard from "next-common/components/fellowship/core/members/card";
import FellowshipMembersEmpty from "./empty";
import { usePageProps } from "next-common/context/page";
import CollectivesProvider from "next-common/context/collectives/collectives";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";

export default function FellowshipCandidatesPage() {
  const { fellowshipParams } = usePageProps();
  const { members } = useFellowshipCoreMembers();
  const pageMembers = useMemo(
    () => (members || []).filter((member) => member.rank <= 0),
    [members],
  );
  const hasMembers = !!pageMembers.length;

  return (
    <CollectivesProvider params={fellowshipParams} section="fellowship">
      <FellowshipMembersLoadable>
        <FellowshipMemberCommon>
          <div className="mb-4 pr-6 leading-8">
            <FellowshipMemberTabs members={members} />
          </div>

          {hasMembers ? (
            <FellowshipCoreMemberCardListContainer>
              {pageMembers.map((member) => (
                <FellowshipCoreMemberCard
                  key={member.address}
                  member={member}
                  params={fellowshipParams}
                />
              ))}
            </FellowshipCoreMemberCardListContainer>
          ) : (
            <FellowshipMembersEmpty />
          )}
        </FellowshipMemberCommon>
      </FellowshipMembersLoadable>
    </CollectivesProvider>
  );
}
