import List from "components/list";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import { EmptyList } from "utils/constants";
import Layout from "components/layout";
import { toReferendaListItem } from "utils/viewfuncs";
import NextHead from "../../components/nextHead";

export default withLoginUserRedux(({ loginUser, posts, chain }) => {
  const items = (posts.items || []).map((item) =>
    toReferendaListItem(chain, item)
  );

  return (
    <Layout user={loginUser} left={<Menu menu={mainMenu} />} chain={chain}>
      <NextHead title={`Democracy Referenda`} desc={`Democracy Referenda`} />
      <List
        chain={chain}
        category={"Referenda"}
        create={null}
        items={items}
        pagination={{
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
      />
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const [{ result: posts }] = await Promise.all([
    nextApi.fetch(`democracy/referendums`, {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
  ]);

  return {
    props: {
      chain,
      posts: posts ?? EmptyList,
    },
  };
});
