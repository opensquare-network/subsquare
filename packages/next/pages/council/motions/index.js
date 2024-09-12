import PostList from "next-common/components/postList";
import { withCommonProps } from "next-common/lib";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeCouncilMotionListItem from "next-common/utils/viewfuncs/collective/normalizeCouncilMotionListItem";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchList } from "next-common/services/list";
import NewCouncilMotionProposalButton from "next-common/components/summary/newCouncilMotionProposalButton";
import CollectiveProvider from "next-common/context/collective";
import Chains from "next-common/utils/consts/chains";
import { TreasuryProvider } from "next-common/context/treasury";

export default function MotionsPage({ motions, chain }) {
  const items = (motions.items || []).map((item) =>
    normalizeCouncilMotionListItem(chain, item),
  );
  const category = businessCategory.councilMotions;
  const seoInfo = { title: category, desc: category };

  let pallet = "council";
  if ([Chains.acala, Chains.karura].includes(chain)) {
    pallet = "generalCouncil";
  }

  return (
    <TreasuryProvider>
      <CollectiveProvider pallet={pallet}>
        <ListLayout
          seoInfo={seoInfo}
          title={category}
          description="Council motions"
        >
          <PostList
            category={category}
            title="List"
            titleCount={motions.total}
            titleExtra={<NewCouncilMotionProposalButton />}
            items={items}
            pagination={{
              page: motions.page,
              pageSize: motions.pageSize,
              total: motions.total,
            }}
          />
        </ListLayout>
      </CollectiveProvider>
    </TreasuryProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const motions = await fetchList("motions", context);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      motions,
      ...tracksProps,
    },
  };
});
