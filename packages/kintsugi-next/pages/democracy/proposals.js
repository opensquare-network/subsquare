import List from "next-common/components/list";
import Menu from "next-common/components/menu";
import { EmptyList, mainMenu } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Layout from "components/layout";
import { toPublicProposalListItem } from "utils/viewfuncs";
import { isSafari } from "../../utils/serverSideUtil";
import DemocracySummary from "next-common/components/summary/democracySummary";

export default withLoginUserRedux(
  ({ loginUser, proposals, chain, siteUrl }) => {
    const items = (proposals.items || []).map((item) =>
      toPublicProposalListItem(chain, item)
    );
    const category = `Democracy Public Proposals`;
    const seoInfo = { title: category, desc: category };

    return (
      <Layout
        user={loginUser}
        left={<Menu menu={mainMenu} chain={chain} />}
        chain={chain}
        seoInfo={seoInfo}
      >
        <List
          chain={chain}
          category={category}
          create={null}
          items={items}
          pagination={{
            page: proposals.page,
            pageSize: proposals.pageSize,
            total: proposals.total,
          }}
          summary={<DemocracySummary chain={chain} />}
        />
      </Layout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  isSafari(context);
  const { page, page_size: pageSize } = context.query;

  const [{ result: proposals }] = await Promise.all([
    nextApi.fetch(`democracy/proposals`, {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
  ]);

  return {
    props: {
      chain,
      proposals: proposals ?? EmptyList,
      siteUrl: process.env.SITE_URL,
    },
  };
});
