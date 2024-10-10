import { usePageProps } from "next-common/context/page";
import CollectivesMemberTable from "next-common/components/collectives/members/table";
import CollectivesProvider from "next-common/context/collectives/collectives";
import useFellowshipCoreMembersFilter, {
  handleFilterMembers,
} from "next-common/components/fellowship/collective/hook/useFellowshipCoreMembersFilter";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

function FellowshipCollectiveMembers({ members, isAllLoaded }) {
  const { fellowshipParams } = usePageProps();

  return (
    <CollectivesProvider section="fellowship" params={fellowshipParams ?? {}}>
      <CollectivesMemberTable members={members} isAllLoaded={isAllLoaded} />
    </CollectivesProvider>
  );
}

export default function FellowshipCollectiveMembersInContext() {
  const { fellowshipMembers } = usePageProps();
  const { members: membersWithStatus, isAllLoaded } =
    handleFilterMembers(fellowshipMembers);

  const { filteredMembers, component: FilterComponent } =
    useFellowshipCoreMembersFilter(membersWithStatus);

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

        {FilterComponent}
      </div>
      <FellowshipCollectiveMembers
        members={filteredMembers}
        isAllLoaded={isAllLoaded}
      />
    </div>
  );
}
