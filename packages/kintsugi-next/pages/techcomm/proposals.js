import PostList from "next-common/components/postList";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import HomeLayout from "next-common/components/layout/HomeLayout";
import normalizeTechCommMotionListItem from "next-common/utils/viewfuncs/collective/normalizeTechCommMotionListItem";

export default withLoginUserRedux(({ proposals, chain }) => {
  const items = (proposals.items || []).map((item) =>
    normalizeTechCommMotionListItem(chain, item),
  );
  const category = "Tech. Comm. Proposals";
  const seoInfo = {
    title: "Technical Committee Proposals",
    desc: "Technical Committee Proposals",
  };

  return (
    <HomeLayout seoInfo={seoInfo}>
      <PostList
        category={category}
        items={items}
        pagination={{
          page: proposals.page,
          pageSize: proposals.pageSize,
          total: proposals.total,
        }}
      />
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { page, page_size: pageSize } = context.query;

  const [{ result: proposals }] = await Promise.all([
    nextApi.fetch("tech-comm/motions", {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
  ]);

  return {
    props: {
      chain,
      proposals: proposals ?? EmptyList,
    },
  };
});
