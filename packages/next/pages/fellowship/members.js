import ListLayout from "next-common/components/layout/ListLayout";
import { usePageProps } from "next-common/context/page";
import FellowshipCollectiveMembers from "next-common/components/fellowship/collective/list";
import useRankFilter from "next-common/hooks/fellowship/useRankFilter";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useMemo } from "react";
import { isNil } from "lodash-es";
import getFellowshipMembersServerSideProps from "next-common/services/serverSide/fellowship/members";
import useFellowshipCoreMembersFilter from "next-common/components/fellowship/collective/hook/useFellowshipCoreMembersFilter";

// TODO: move into next-common/components/
export default function MembersPage() {
  const { fellowshipMembers } = usePageProps();
  const category = "Fellowship Members";
  const seoInfo = { title: category, desc: category };
  const ranks = [...new Set(fellowshipMembers.map((m) => m.rank))];
  const { rank, component } = useRankFilter(ranks);

  const { filteredMembers, component: FilterComponent } =
    useFellowshipCoreMembersFilter(fellowshipMembers);

  const membersCount = filteredMembers?.length;

  // const filteredMembers = useMemo(() => {
  //   // TODO: read status by isFellowshipOnly
  //   if (true) {
  //     return membersWithStatus.filter((m) => m.isFellowshipOnly);
  //   }

  //   if (isNil(rank)) {
  //     return membersWithStatus;
  //   }

  //   return membersWithStatus.filter((m) => m.rank === rank);
  // }, [membersWithStatus, rank]);

  return (
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
          {component}
        </TitleContainer>
        <FellowshipCollectiveMembers members={filteredMembers} />
      </div>
    </ListLayout>
  );
}

export const getServerSideProps = getFellowshipMembersServerSideProps;
