import List from "components/tip/list";
import Layout from "components/layout";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "../../lib";
import nextApi from "../../services/nextApi";
import { EmptyList } from "../../utils/constants";
import { addressEllipsis } from "../../utils";

export default withLoginUserRedux(({loginUser, tips, chain}) => {
  const items = (tips.items || []).map((tip) => ({
    time: tip.indexer.blockTime,
    comments: tip.commentsCount,
    title: tip.title,
    author: tip.author ?? {username: addressEllipsis(tip.finder), addresses: [{chain, address: tip.finder}]},
    tipUid: tip.tipUid,
  }));


  return (
    <Layout user={loginUser} left={<Menu menu={mainMenu}/>} chain={chain}>
      <List
        chain={chain}
        category={"Tips"}
        create={null}
        items={items}
        pagination={{
          page: tips.page,
          pageSize: tips.pageSize,
          total: tips.total,
        }}
      />
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const {page, chain, page_size: pageSize} = context.query;

  const [{result: tips}] = await Promise.all([
    nextApi.fetch(`${chain}/tips`, {page, pageSize: pageSize ?? 50}),
  ]);

  return {
    props: {
      chain,
      tips: tips ?? EmptyList,
    },
  };
});
