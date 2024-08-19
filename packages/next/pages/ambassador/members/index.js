import getAmbassadorMembersServerSideProps from "next-common/services/serverSide/ambassador/members";
import { usePageProps } from "next-common/context/page";
import useRankFilter from "next-common/hooks/fellowship/useRankFilter";
import { useMemo } from "react";
import { isNil } from "lodash-es";
import ListLayout from "next-common/components/layout/ListLayout";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import CollectivesMemberTable from "next-common/components/collectives/members/table";
import CollectivesProvider from "next-common/context/collectives/collectives";

export default function MembersPage() {
  const { ambassadorMembers, ambassadorParams } = usePageProps();
  const category = "Ambassador Members";
  const seoInfo = { title: category, desc: category };
  const ranks = [...new Set(ambassadorMembers.map((m) => m.rank))];
  const { rank, component } = useRankFilter(ranks);

  const filteredMembers = useMemo(() => {
    if (isNil(rank)) {
      return ambassadorMembers;
    }

    return ambassadorMembers.filter((m) => m.rank === rank);
  }, [ambassadorMembers, rank]);

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
        <CollectivesProvider
          section="ambassador"
          params={ambassadorParams ?? {}}
        >
          <CollectivesMemberTable members={filteredMembers} />
        </CollectivesProvider>
      </div>
    </ListLayout>
  );
}

export const getServerSideProps = getAmbassadorMembersServerSideProps;
