import PostList from "next-common/components/postList";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { toTreasuryBountyListItem } from "utils/viewfuncs";
import Summary from "next-common/components/summary";
import HomeLayout from "next-common/components/layout/HomeLayout";

export default withLoginUserRedux(({ loginUser, bounties, chain }) => {
  const items = (bounties.items || []).map((item) =>
    toTreasuryBountyListItem(chain, item)
  );
  const category = "Treasury Bounties";
  const seoInfo = { title: category, desc: category };

  return (
    <HomeLayout user={loginUser} seoInfo={seoInfo}>
      <PostList
        chain={chain}
        category={category}
        create={null}
        items={items}
        summary={<Summary chain={chain} />}
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
    nextApi.fetch(`treasury/bounties`, {
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
