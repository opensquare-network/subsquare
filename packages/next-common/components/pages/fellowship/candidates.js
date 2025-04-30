import { useMemo } from "react";
import FellowshipMembersLoadable from "next-common/components/pages/fellowship/loadable";
import FellowshipMemberCommon from "next-common/components/pages/fellowship/common";
import FellowshipMemberTabs from "next-common/components/fellowship/core/members/tabs";
import FellowshipCoreMemberCardListContainer from "next-common/components/fellowship/core/members/listContainer";
import FellowshipCoreMemberCard from "next-common/components/fellowship/core/members/card";
import FellowshipMembersEmpty from "./empty";
import { usePageProps } from "next-common/context/page";
import CollectivesProvider, {
  useCollectivesContext,
} from "next-common/context/collectives/collectives";
import useFellowshipCoreMembersWithRank from "next-common/hooks/fellowship/core/useFellowshipCoreMembersWithRank";
import { useMembersWithStatus2 } from "next-common/components/fellowship/collective/hook/useFellowshipCoreMembersFilter";

export default function FellowshipCandidatesPage() {
  const { fellowshipParams } = usePageProps();

  return (
    <CollectivesProvider section="fellowship" params={fellowshipParams}>
      <FellowshipCandidatesPageImpl />
    </CollectivesProvider>
  );
}

function useFellowshipMembersData() {
  const { fellowshipMembers } = usePageProps();
  const { membersWithStatus } = useMembersWithStatus2(fellowshipMembers);

  const membersCount = useMemo(
    () =>
      (membersWithStatus || []).filter(
        (member) => member.isFellowshipCoreMember,
      ).length,
    [membersWithStatus],
  );

  const candidatesCount = useMemo(
    () => (membersWithStatus || []).filter((member) => member.rank <= 0).length,
    [membersWithStatus],
  );

  return {
    membersCount,
    candidatesCount,
  };
}

function FellowshipCandidatesPageImpl() {
  const { params } = useCollectivesContext();
  const { members } = useFellowshipCoreMembersWithRank();
  const pageMembers = useMemo(
    () => (members || []).filter((member) => member.rank <= 0),
    [members],
  );
  const hasMembers = !!pageMembers.length;
  const { membersCount, candidatesCount } = useFellowshipMembersData();

  return (
    <FellowshipMembersLoadable>
      <FellowshipMemberCommon>
        <div className="mb-4 pr-6 leading-8">
          <FellowshipMemberTabs
            members={members}
            membersCount={membersCount}
            candidatesCount={candidatesCount}
          />
        </div>

        {hasMembers ? (
          <FellowshipCoreMemberCardListContainer>
            {pageMembers.map((member) => (
              <FellowshipCoreMemberCard
                key={member.address}
                member={member}
                params={params}
                isCandidate={true}
              />
            ))}
          </FellowshipCoreMemberCardListContainer>
        ) : (
          <FellowshipMembersEmpty />
        )}
      </FellowshipMemberCommon>
    </FellowshipMembersLoadable>
  );
}
