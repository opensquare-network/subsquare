import ListLayout from "next-common/components/layout/ListLayout";
import { usePageProps } from "next-common/context/page";
import FellowshipCollectiveMembers from "next-common/components/fellowship/collective/list";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import getFellowshipMembersServerSideProps from "next-common/services/serverSide/fellowship/members";
import useFellowshipCoreMembersFilter from "next-common/components/fellowship/collective/hook/useFellowshipCoreMembersFilter";
import CollectivesProvider from "next-common/context/collectives/collectives";

export default function MembersPage() {
  const { fellowshipMembers } = usePageProps();
  const category = "Fellowship Members";
  const seoInfo = { title: category, desc: category };

  const { filteredMembers, component: FilterComponent } =
    useFellowshipCoreMembersFilter(fellowshipMembers);

  const membersCount = filteredMembers?.length || 0;

  return (
    <CollectivesProvider section="fellowship">
      <ListLayout seoInfo={seoInfo} title={category}>
        <div className="flex flex-col gap-y-4">
          <TitleContainer>
            <span>
              List
              <span className="text-textTertiary text14Medium ml-1">
                {membersCount}
              </span>
            </span>
            {FilterComponent}
          </TitleContainer>
          <FellowshipCollectiveMembers members={filteredMembers} />
        </div>
      </ListLayout>
    </CollectivesProvider>
  );
}

export const getServerSideProps = getFellowshipMembersServerSideProps;
