import List from "next-common/components/list";
import Menu from "next-common/components/menu";
import { mainMenu } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Layout from "components/layout";
import { toTechCommMotionListItem } from "utils/viewfuncs";
import SEO from "next-common/components/SEO";
import { isSafari } from "../../utils/serverSideUtil";

export default withLoginUserRedux(
  ({ loginUser, proposals, chain, siteUrl }) => {
    const items = (proposals.items || []).map((item) =>
      toTechCommMotionListItem(chain, item)
    );
    const category = `Tech. Comm. Proposals`;
    const seoInfo = {
      title: `Technical Committee Proposals`,
      desc: `Technical Committee Proposals`,
    };

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
    nextApi.fetch(`tech-comm/motions`, {
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
