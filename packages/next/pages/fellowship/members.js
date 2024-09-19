import ListLayout from "next-common/components/layout/ListLayout";
import { usePageProps } from "next-common/context/page";
import FellowshipCollectiveMembers from "next-common/components/fellowship/collective/list";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import getFellowshipMembersServerSideProps from "next-common/services/serverSide/fellowship/members";
import useFellowshipCoreMembersFilter, {
  handleFilterMembers,
} from "next-common/components/fellowship/collective/hook/useFellowshipCoreMembersFilter";
import CollectivesProvider from "next-common/context/collectives/collectives";

function FellowshipCollectiveMembersInContext() {
  const { fellowshipMembers } = usePageProps();
  const { members: membersWithStatus, isAllLoaded } =
    handleFilterMembers(fellowshipMembers);

  const { filteredMembers, component: FilterComponent } =
    useFellowshipCoreMembersFilter(membersWithStatus);

  const membersCount = filteredMembers?.length || 0;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-wrap max-md:flex-col md:items-center gap-[12px] max-md:gap-[16px] justify-between mb-4 pr-6">
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

export default function MembersPage() {
  const { fellowshipParams } = usePageProps();
  const category = "Fellowship Members";
  const seoInfo = { title: category, desc: category };

  return (
    <CollectivesProvider params={fellowshipParams} section="fellowship">
      <ListLayout seoInfo={seoInfo} title={category}>
        <FellowshipCollectiveMembersInContext />
      </ListLayout>
    </CollectivesProvider>
  );
}

export const getServerSideProps = getFellowshipMembersServerSideProps;
