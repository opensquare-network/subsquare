import { usePageProps } from "next-common/context/page";
import useAmbassadorCoreSortedMembers from "next-common/hooks/ambassador/core/useAmbassadorCoreSortedMembers";
import { useMemo } from "react";
import AmbassadorMembersLoadable from "next-common/components/pages/ambassador/loadable";
import AmbassadorCoreCommon from "next-common/components/ambassador/core/common";
import FellowshipMemberTabs from "next-common/components/fellowship/core/members/tabs";
import FellowshipCoreMemberCardListContainer from "next-common/components/fellowship/core/members/listContainer";
import AmbassadorCoreMemberCard from "next-common/components/ambassador/core/members/card";
import FellowshipMembersEmpty from "next-common/components/pages/fellowship/empty";
import CollectivesProvider from "next-common/context/collectives/collectives";

export default function AmbassadorCandidatesPage() {
  const { ambassadorParams } = usePageProps();
  const members = useAmbassadorCoreSortedMembers();
  const pageMembers = useMemo(
    () => (members || []).filter((member) => member.rank <= 0),
    [members],
  );

  const hasMembers = !!pageMembers.length;

  return (
    <CollectivesProvider params={ambassadorParams} section="fellowship">
      <AmbassadorMembersLoadable>
        <AmbassadorCoreCommon>
          <div className="mb-4 pr-6 leading-8">
            <FellowshipMemberTabs members={members} section="ambassador" />
          </div>

          {hasMembers ? (
            <FellowshipCoreMemberCardListContainer>
              {pageMembers.map((member) => (
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
        </AmbassadorCoreCommon>
      </AmbassadorMembersLoadable>
    </CollectivesProvider>
  );
}
