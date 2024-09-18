import ListLayout from "next-common/components/layout/ListLayout";
import { usePageProps } from "next-common/context/page";
import FellowshipCollectiveMembers from "next-common/components/fellowship/collective/list";
import useRankFilter from "next-common/hooks/fellowship/useRankFilter";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useMemo } from "react";
import { isNil } from "lodash-es";
import getFellowshipMembersServerSideProps from "next-common/services/serverSide/fellowship/members";
import useSubCoreCollectivesMember from "next-common/hooks/collectives/useSubCoreCollectivesMember";

function isFellowshipCoreOnly(item) {
  const { member: memberStatus, isLoading } = useSubCoreCollectivesMember(
    item.address,
  );
  return !isNil(memberStatus) && !isLoading;
}

function handleFilterMembers(members) {
  return members.map((item) => {
    return {
      ...item,
      isFellowshipOnly: isFellowshipCoreOnly(item),
    };
  });
}

// TODO: move into next-common/components/
export default function MembersPage() {
  const { fellowshipMembers } = usePageProps();
  const category = "Fellowship Members";
  const seoInfo = { title: category, desc: category };
  const ranks = [...new Set(fellowshipMembers.map((m) => m.rank))];
  const { rank, component } = useRankFilter(ranks);

  const membersWithStatus = handleFilterMembers(fellowshipMembers);

  const filteredMembers = useMemo(() => {
    // TODO: read status by isFellowshipOnly
    if (true) {
      return membersWithStatus.filter((m) => m.isFellowshipOnly);
    }

    if (isNil(rank)) {
      return membersWithStatus;
    }

    return membersWithStatus.filter((m) => m.rank === rank);
  }, [membersWithStatus, rank]);

  return (
    <ListLayout seoInfo={seoInfo} title={category}>
      <div className="flex flex-col gap-y-4">
        <TitleContainer>
          <span>
            List
            <span className="text-textTertiary text14Medium ml-1">
              {filteredMembers.length}
            </span>
          </span>
          {component}
        </TitleContainer>
        <FellowshipCollectiveMembers members={filteredMembers} />
      </div>
    </ListLayout>
  );
}

export const getServerSideProps = getFellowshipMembersServerSideProps;
