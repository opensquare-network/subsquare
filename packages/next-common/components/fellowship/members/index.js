import { usePageProps } from "next-common/context/page";
import FellowshipMemberTable from "./table";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import useRankFilter from "./useRankFilter";

function FellowshipMembers({ members }) {
  const { fellowshipParams } = usePageProps();

  return (
    <CollectivesProvider section="fellowship" params={fellowshipParams ?? {}}>
      <FellowshipMemberTable members={members} />
    </CollectivesProvider>
  );
}

export default function FellowshipCollectiveMembersInContext() {
  const { fellowshipMembers } = usePageProps();
  const { filteredMembers, component: RankFilterComponent } =
    useRankFilter(fellowshipMembers);

  const membersCount = filteredMembers?.length || 0;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-wrap max-md:flex-col md:items-center gap-[12px] max-md:gap-[16px] justify-between pr-6">
        <TitleContainer>
          <span>
            List
            <span className="text-textTertiary text14Medium ml-1">
              {membersCount}
            </span>
          </span>
        </TitleContainer>

        {RankFilterComponent}
      </div>
      <FellowshipMembers members={filteredMembers} />
    </div>
  );
}
