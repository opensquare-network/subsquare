import { usePageProps } from "next-common/context/page";
import { useMemo } from "react";
import AmbassadorCoreCommon from "next-common/components/ambassador/core/common";
import FellowshipMemberTabs from "next-common/components/fellowship/core/members/tabs";
import FellowshipCoreMemberCardListContainer from "next-common/components/fellowship/core/members/listContainer";
import AmbassadorCoreMemberCard from "next-common/components/ambassador/core/members/card";
import FellowshipMembersEmpty from "next-common/components/pages/fellowship/empty";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import FellowshipMembersLoadable from "../fellowship/loadable";
import useFellowshipSortedCoreMembers from "next-common/hooks/fellowship/core/useFellowshipSortedCoreMembers";

export default function AmbassadorCandidatesPage() {
  const { ambassadorParams } = usePageProps();
  const members = useFellowshipSortedCoreMembers();
  const pageMembers = useMemo(
    () => (members || []).filter((member) => member.rank <= 0),
    [members],
  );

  const hasMembers = !!pageMembers.length;

  return (
    <CollectivesProvider params={ambassadorParams} section="ambassador">
      <FellowshipMembersLoadable>
        <ActiveReferendaProvider pallet="ambassadorReferenda">
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
        </ActiveReferendaProvider>
      </FellowshipMembersLoadable>
    </CollectivesProvider>
  );
}
