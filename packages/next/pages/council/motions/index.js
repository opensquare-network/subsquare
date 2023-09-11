import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeCouncilMotionListItem from "next-common/utils/viewfuncs/collective/normalizeCouncilMotionListItem";
import ListLayout from "next-common/components/layout/ListLayout";
import Chains from "next-common/utils/consts/chains";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default withLoginUserRedux(({ motions, chain }) => {
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
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { page, page_size: pageSize } = context.query;

  let listApi = "motions";
  if ([Chains.moonbeam, Chains.moonriver].includes(chain)) {
    listApi = "moon-council/motions";
  }

  const [{ result: motions }] = await Promise.all([
    nextApi.fetch(listApi, {
      page: page ?? 1,
      pageSize: pageSize ?? defaultPageSize,
    }),
  ]);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      chain,
      motions: motions ?? EmptyList,
      ...tracksProps,
    },
  };
});
