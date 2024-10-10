import { usePageProps } from "next-common/context/page";
import FellowshipMemberTable from "./table";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import useRankFilter from "./useRankFilter";

export default function FellowshipMembersInContext() {
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
      <FellowshipMemberTable members={filteredMembers} />
    </div>
  );
}
