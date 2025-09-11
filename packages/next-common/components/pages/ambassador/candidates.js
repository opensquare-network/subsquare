import { usePageProps } from "next-common/context/page";
import { useMemo } from "react";
import AmbassadorCoreCommon from "next-common/components/ambassador/core/common";
import FellowshipCoreMemberCardListContainer from "next-common/components/fellowship/core/members/listContainer";
import AmbassadorCoreMemberCard from "next-common/components/ambassador/core/members/card";
import FellowshipMembersEmpty from "next-common/components/pages/fellowship/empty";
import CollectivesProvider, {
  useCollectivesContext,
} from "next-common/context/collectives/collectives";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import FellowshipMembersLoadable from "../fellowship/loadable";
import useFellowshipSortedCoreMembers from "next-common/hooks/fellowship/core/useFellowshipSortedCoreMembers";
import LegacyFellowshipMemberTabs from "next-common/components/fellowship/core/members/tabs/legacy";

export default function AmbassadorCandidatesPage() {
  const { ambassadorParams } = usePageProps();

  return (
    <CollectivesProvider section="ambassador" params={ambassadorParams}>
      <AmbassadorCandidatesPageImpl />
    </CollectivesProvider>
  );
}

function AmbassadorCandidatesPageImpl() {
  const { params } = useCollectivesContext();
  const members = useFellowshipSortedCoreMembers();
  const pageMembers = useMemo(
    () => (members || []).filter((member) => member.rank <= 0),
    [members],
  );

  const hasMembers = !!pageMembers.length;

  return (
    <FellowshipMembersLoadable>
      <ActiveReferendaProvider pallet="ambassadorReferenda">
        <AmbassadorCoreCommon>
          <div className="flex mb-4 pr-6 leading-8 h-[40px]">
            <LegacyFellowshipMemberTabs
              members={members}
              section="ambassador"
            />
          </div>

          {hasMembers ? (
            <FellowshipCoreMemberCardListContainer>
              {pageMembers.map((member) => (
                <AmbassadorCoreMemberCard
                  key={member.address}
                  member={member}
                  params={params}
                />
              ))}
            </FellowshipCoreMemberCardListContainer>
          ) : (
            <FellowshipMembersEmpty />
          )}
        </AmbassadorCoreCommon>
      </ActiveReferendaProvider>
    </FellowshipMembersLoadable>
  );
}
