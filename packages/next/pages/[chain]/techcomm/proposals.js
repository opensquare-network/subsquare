import List from "components/list";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import nextApi from "services/nextApi";
import { EmptyList } from "utils/constants";
import { addressEllipsis } from "utils";
import LayoutFixedHeader from "components/layoutFixedHeader";

function getMotionType(motion) {
  return motion.isTreasury ? "Treasury" : "";
}

export default withLoginUserRedux(({ loginUser, proposals, chain }) => {
  const items = (proposals.items || []).map((item) => ({
    time: item.indexer.blockTime,
    commentsCount: item.commentsCount,
    title: `${item.proposal.section}.${item.proposal.method}`,
    type: getMotionType(item),
    author: item.author ?? {
      username: addressEllipsis(item.proposer),
      addresses: [{ chain, address: item.proposer }],
    },
    proposal: item.proposal,
    height: item.indexer.blockHeight,
    hash: item.hash,
    status: item.state.state ?? "Unknown",
    index: item.index,
    proposalIndex: item.index,
  }));

  return (
    <LayoutFixedHeader
      user={loginUser}
      left={<Menu menu={mainMenu} />}
      chain={chain}
    >
      <List
        chain={chain}
        category={"Technical Committee Proposals"}
        create={null}
        items={items}
        pagination={{
          page: proposals.page,
          pageSize: proposals.pageSize,
          total: proposals.total,
        }}
        type="techcomm"
      />
    </LayoutFixedHeader>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { page, chain, page_size: pageSize } = context.query;

  const [{ result: proposals }] = await Promise.all([
    nextApi.fetch(`${chain}/tech-comm/motions`, {
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
