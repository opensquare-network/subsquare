import FellowshipMemberTabs from "next-common/components/fellowship/core/members/tabs";
import useRankFilter from "next-common/hooks/fellowship/useRankFilter";
import { useMemo } from "react";
import { isNil } from "lodash-es";
import FellowshipCoreMemberCardListContainer from "next-common/components/fellowship/core/members/listContainer";
import FellowshipMembersEmpty from "next-common/components/pages/fellowship/empty";
import AmbassadorCoreMemberCard from "next-common/components/ambassador/core/members/card";
import { usePageProps } from "next-common/context/page";
import AmbassadorMemberCommon from "next-common/components/pages/ambassador/common";
import CollectivesProvider from "next-common/context/collectives/collectives";
import FellowshipMembersLoadable from "../fellowship/loadable";
import useFellowshipSortedCoreMembers from "next-common/hooks/fellowship/core/useFellowshipSortedCoreMembers";
import useMembersWithSortMeToFirst from "../useMembersWIthSortMeToFirst";

export default function AmbassadorCoreMembersPage() {
  const { ambassadorParams } = usePageProps();

  return (
    <CollectivesProvider params={ambassadorParams} section="ambassador">
      <AmbassadorCoreMembersPageInContext />
    </CollectivesProvider>
  );
}

function AmbassadorCoreMembersPageInContext() {
  const { ambassadorParams } = usePageProps();
  const members = useFellowshipSortedCoreMembers();
  const pageMembers = useMemo(
    () => (members || []).filter((member) => member.rank > 0),
    [members],
  );
  const ranks = [...new Set(pageMembers.map((m) => m.rank))];
  const { rank, component } = useRankFilter(ranks);
  const filteredMembers = useMemo(() => {
    if (isNil(rank)) {
      return pageMembers;
    } else {
      return pageMembers.filter((m) => m.rank === rank);
    }
  }, [pageMembers, rank]);

  const sortedFilteredMembers = useMembersWithSortMeToFirst(filteredMembers);

  const hasMembers = !!pageMembers.length;

  return (
    <FellowshipMembersLoadable>
      <AmbassadorMemberCommon>
        <div className="flex items-center justify-between mb-4 pr-6">
          <FellowshipMemberTabs members={members} section="ambassador" />
          {component}
        </div>

        {hasMembers ? (
          <FellowshipCoreMemberCardListContainer>
            {sortedFilteredMembers.map((member) => (
              <AmbassadorCoreMemberCard
                key={member.address}
                member={member}
                params={ambassadorParams}
              />
            ))}
          </FellowshipCoreMemberCardListContainer>
        ) : (
          <FellowshipMembersEmpty />
        )}
      </AmbassadorMemberCommon>
    </FellowshipMembersLoadable>
  );
}
