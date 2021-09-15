import List from "components/list";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import nextApi from "services/nextApi";
import { EmptyList } from "utils/constants";
import { addressEllipsis } from "utils";
import LayoutFixedHeader from "components/layoutFixedHeader";

export default withLoginUserRedux(({ loginUser, externals, chain }) => {
  const items = (externals.items || []).map((external) => ({
    time: external.indexer.blockTime,
    commentsCount: external.commentsCount,
    title: external.title,
    author: external.author ?? {
      username: addressEllipsis(external.proposer),
      addresses: [{ chain, address: external.proposer }],
    },
    height: external.height,
    hash: external.externalProposalHash,
    status: external.state ?? "Unknown",
    externalIndex: external.externalIndex,
  }));

  return (
    <LayoutFixedHeader
      user={loginUser}
      left={<Menu menu={mainMenu} />}
      chain={chain}
    >
      <List
        chain={chain}
        category={"External Proposals"}
        create={null}
        items={items}
        pagination={{
          page: externals.page,
          pageSize: externals.pageSize,
          total: externals.total,
        }}
        type="democracy"
      />
    </LayoutFixedHeader>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { page, chain, page_size: pageSize } = context.query;

  const [{ result: externals }] = await Promise.all([
    nextApi.fetch(`${chain}/democracy/externals`, {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
  ]);

  return {
    props: {
      chain,
      externals: externals ?? EmptyList,
    },
  };
});
