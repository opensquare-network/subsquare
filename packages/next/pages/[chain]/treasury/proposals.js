import List from "components/list";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import nextApi from "services/nextApi";
import { EmptyList } from "utils/constants";
import { addressEllipsis } from "utils";
import LayoutFixedHeader from "components/layoutFixedHeader";

export default withLoginUserRedux(({ loginUser, proposals, chain }) => {
  const items = (proposals.items || []).map((proposal) => ({
    time: proposal.indexer.blockTime,
    commentsCount: proposal.commentsCount,
    title: proposal.title,
    author: proposal.author ?? {
      username: addressEllipsis(proposal.proposer),
      addresses: [{ chain, address: proposal.proposer }],
    },
    height: proposal.height,
    hash: proposal.hash,
    status: proposal.state ?? "Unknown",
    index: proposal.proposalIndex,
  }));

  return (
    <LayoutFixedHeader
      user={loginUser}
      left={<Menu menu={mainMenu} />}
      chain={chain}
    >
      <List
        chain={chain}
        category={"Treasury Proposals"}
        create={null}
        items={items}
        pagination={{
          page: proposals.page,
          pageSize: proposals.pageSize,
          total: proposals.total,
        }}
        type="treasury"
      />
    </LayoutFixedHeader>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { page, chain, page_size: pageSize } = context.query;

  const [{ result: proposals }] = await Promise.all([
    nextApi.fetch(`${chain}/treasury/proposals`, {
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
