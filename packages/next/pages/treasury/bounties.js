import PostList from "next-common/components/postList";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Summary from "next-common/components/summary";
import HomeLayout from "next-common/components/layout/HomeLayout";
import normalizeBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeBountyListItem";

export default withLoginUserRedux(({ bounties, chain }) => {
  const items = (bounties.items || []).map((item) =>
    normalizeBountyListItem(chain, item)
  );
  const category = "Treasury Bounties";
  const seoInfo = { title: category, desc: category };

  return (
    <HomeLayout seoInfo={seoInfo}>
      <PostList
        category={category}
        create={null}
        items={items}
        summary={<Summary />}
        pagination={{
          page: bounties.page,
          pageSize: bounties.pageSize,
          total: bounties.total,
        }}
      />
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const [{ result: bounties }] = await Promise.all([
    nextApi.fetch("treasury/bounties", {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
  ]);

  return {
    props: {
      chain,
      bounties: bounties ?? EmptyList,
    },
  };
});
