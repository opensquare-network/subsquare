import PostList from "next-common/components/postList";
import { withLoginUser } from "next-common/lib";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeCouncilMotionListItem from "next-common/utils/viewfuncs/collective/normalizeCouncilMotionListItem";
import ListLayout from "next-common/components/layout/ListLayout";
import Chains from "next-common/utils/consts/chains";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchList } from "next-common/services/list";

export default function MotionsPage({ motions, chain }) {
  const items = (motions.items || []).map((item) =>
    normalizeCouncilMotionListItem(chain, item),
  );
  const category = businessCategory.councilMotions;
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="Council motions"
    >
      <PostList
        category={category}
        title="List"
        titleCount={motions.total}
        items={items}
        pagination={{
          page: motions.page,
          pageSize: motions.pageSize,
          total: motions.total,
        }}
      />
    </ListLayout>
  );
}

export const getServerSideProps = withLoginUser(async (context) => {
  let listApiUrl = "motions";
  if ([Chains.moonbeam, Chains.moonriver].includes(process.env.CHAIN)) {
    listApiUrl = "moon-council/motions";
  }
  const motions = await fetchList(listApiUrl, context);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      motions,
      ...tracksProps,
    },
  };
});
