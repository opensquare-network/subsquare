import { isNil } from "lodash-es";
import FellowshipMemberTabs from "next-common/components/fellowship/core/members/tabs";
import { useMemo } from "react";
import useRankFilter from "next-common/hooks/fellowship/useRankFilter";
import FellowshipMembersLoadable from "next-common/components/pages/fellowship/loadable";
import FellowshipMemberCommon from "next-common/components/pages/fellowship/common";
import FellowshipCoreMemberCardListContainer from "next-common/components/fellowship/core/members/listContainer";
import FellowshipCoreMemberCard from "next-common/components/fellowship/core/members/card";
import FellowshipMembersEmpty from "./empty";
import useSortedCoreMembers from "next-common/hooks/fellowship/core/useSortedCoreMembers";
import { usePageProps } from "next-common/context/page";
import CollectivesProvider from "next-common/context/collectives/collectives";

export default function FellowshipMembersPage() {
  const members = useSortedCoreMembers();
  const { fellowshipParams } = usePageProps();
  const pageMembers = useMemo(
    () => (members || []).filter((member) => member.rank > 0),
    [members],
  );
  const hasMembers = !!pageMembers.length;

  const ranks = [...new Set(pageMembers.map((m) => m.rank))];
  const { rank, component } = useRankFilter(ranks);

  const filteredMembers = useMemo(() => {
    if (isNil(rank)) {
      return pageMembers;
    } else {
      return pageMembers.filter((m) => m.rank === rank);
    }
  }, [pageMembers, rank]);

  return (
    <CollectivesProvider params={fellowshipParams} section="fellowship">
      <FellowshipMembersLoadable>
        <FellowshipMemberCommon>
          <div className="flex items-center justify-between mb-4 pr-6">
            <FellowshipMemberTabs members={members} />
            {component}
          </div>

          {hasMembers ? (
            <FellowshipCoreMemberCardListContainer>
              {filteredMembers.map((member) => (
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
