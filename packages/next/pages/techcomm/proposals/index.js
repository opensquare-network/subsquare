import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeTechCommMotionListItem from "next-common/utils/viewfuncs/collective/normalizeTechCommMotionListItem";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default withLoginUserRedux(({ proposals, chain }) => {
  const items = (proposals.items || []).map((item) =>
    normalizeTechCommMotionListItem(chain, item),
  );
  const category = businessCategory.tcProposals;
  const seoInfo = {
    title: "Technical Committee Proposals",
    desc: "Technical Committee Proposals",
  };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="Technical committee proposals"
    >
      <PostList
        category={category}
        title="List"
        titleCount={proposals.total}
        items={items}
        pagination={{
          page: proposals.page,
          pageSize: proposals.pageSize,
          total: proposals.total,
        }}
      />
    </ListLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { page, page_size: pageSize } = context.query;

  const [{ result: proposals }] = await Promise.all([
    nextApi.fetch("tech-comm/motions", {
      page: page ?? 1,
      pageSize: pageSize ?? defaultPageSize,
    }),
  ]);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      proposals: proposals ?? EmptyList,
      ...tracksProps,
    },
  };
});
