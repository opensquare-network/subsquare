import AmbassadorMembersLoadable from "next-common/components/pages/ambassador/loadable";
import useAmbassadorCoreSortedMembers from "next-common/hooks/ambassador/core/useAmbassadorCoreSortedMembers";
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

export default function AmbassadorCoreMembersPage() {
  const { ambassadorParams } = usePageProps();
  const members = useAmbassadorCoreSortedMembers();
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

  const hasMembers = !!pageMembers.length;

  return (
    <CollectivesProvider params={ambassadorParams} section="ambassador">
      <AmbassadorMembersLoadable>
        <AmbassadorMemberCommon params={ambassadorParams}>
          <div className="flex items-center justify-between mb-4 pr-6">
            <FellowshipMemberTabs members={members} section="ambassador" />
            {component}
          </div>

          {hasMembers ? (
            <FellowshipCoreMemberCardListContainer>
              {filteredMembers.map((member) => (
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
      </AmbassadorMembersLoadable>
    </CollectivesProvider>
  );
}
