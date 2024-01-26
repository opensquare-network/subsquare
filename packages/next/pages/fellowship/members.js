import ListLayout from "next-common/components/layout/ListLayout";
import { usePageProps } from "next-common/context/page";
import useFetchFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFetchFellowshipCoreMembers";
import FellowshipCollectiveMembers from "next-common/components/fellowship/collective/list";
import useRankFilter from "next-common/hooks/fellowship/useRankFilter";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useMemo } from "react";
import isNil from "lodash.isnil";
import getFellowshipMembersServerSideProps from "next-common/services/serverSide/fellowship/members";

export default function MembersPage() {
  const { fellowshipMembers } = usePageProps();
  const category = "Fellowship Members";
  const seoInfo = { title: category, desc: category };
  useFetchFellowshipCoreMembers(fellowshipMembers);
  const ranks = [...new Set(fellowshipMembers.map((m) => m.rank))];
  const { rank, component } = useRankFilter(ranks);

  const filteredMembers = useMemo(() => {
    if (isNil(rank)) {
      return fellowshipMembers;
    }

    return fellowshipMembers.filter((m) => m.rank === rank);
  }, [fellowshipMembers, rank]);

  return (
    <ListLayout seoInfo={seoInfo} title={category}>
      <div className="flex flex-col gap-y-4">
        <TitleContainer>
          <span>List</span>
          {component}
        </TitleContainer>
        <FellowshipCollectiveMembers members={filteredMembers} />
      </div>
    </ListLayout>
  );
}

export const getServerSideProps = getFellowshipMembersServerSideProps;
