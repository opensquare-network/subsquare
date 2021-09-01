import List from "components/list";
import Layout from "components/layout";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "../../lib";
import nextApi from "../../services/nextApi";
import { EmptyList } from "../../utils/constants";
import { addressEllipsis } from "../../utils";

export default withLoginUserRedux(({ loginUser, proposals, chain }) => {
  const items = (proposals.items || []).map((proposal) => ({
    time: proposal.indexer.blockTime,
    commentsCount: proposal.commentsCount,
    title: proposal.title,
    author: proposal.author ?? {
      username: addressEllipsis(proposal.proposer),
      addresses: [{ chain, address: proposal.proposer }],
    },
    tipUid: proposal.tipUid,
    height: proposal.height,
    hash: proposal.hash,
    status: proposal.state ?? "Unknown",
    proposalIndex: proposal.proposalIndex,
  }));

  return (
    <Layout user={loginUser} left={<Menu menu={mainMenu} />} chain={chain}>
      <List
        chain={chain}
        category={"Proposals"}
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
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { page, chain, page_size: pageSize } = context.query;

  const [{ result: proposals }] = await Promise.all([
    nextApi.fetch(`${chain}/proposals`, { page, pageSize: pageSize ?? 50 }),
  ]);

  return {
    props: {
      chain,
      proposals: proposals ?? EmptyList,
    },
  };
});
