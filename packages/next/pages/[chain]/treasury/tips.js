import List from "components/list";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import nextApi from "services/nextApi";
import { EmptyList } from "utils/constants";
import { addressEllipsis } from "utils";
import LayoutFixedHeader from "components/layoutFixedHeader";

export default withLoginUserRedux(({ loginUser, tips, chain }) => {
  const items = (tips.items || []).map((tip) => ({
    time: tip.indexer.blockTime,
    commentsCount: tip.commentsCount,
    title: tip.title,
    author: tip.author ?? {
      username: addressEllipsis(tip.finder),
      addresses: [{ chain, address: tip.finder }],
    },
    height: tip.height,
    hash: tip.hash,
    status: tip.state
      ? tip.state.state === "Tipping"
        ? `Tipping (${tip.state.tipsCount})`
        : tip.state.state
      : "Unknown",
  }));

  return (
    <LayoutFixedHeader
      user={loginUser}
      left={<Menu menu={mainMenu} />}
      chain={chain}
    >
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
    </LayoutFixedHeader>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { page, chain, page_size: pageSize } = context.query;

  const [{ result: tips }] = await Promise.all([
    nextApi.fetch(`${chain}/treasury/tips`, {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
  ]);

  return {
    props: {
      chain,
      tips: tips ?? EmptyList,
    },
  };
});
