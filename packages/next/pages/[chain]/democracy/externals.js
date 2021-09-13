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
    commentsCount: proposal.commentsCount,
    title: proposal.title,
    author: proposal.author ?? {
      username: addressEllipsis(proposal.proposer),
      addresses: [{ chain, address: proposal.proposer }],
    },
    height: proposal.height,
    hash: proposal.hash,
    status: proposal.state ?? "Unknown",
    proposalIndex: proposal.proposalIndex,
    type: "Democracy",
  }));

  return (
    <LayoutFixedHeader
      user={loginUser}
      left={<Menu menu={mainMenu} />}
      chain={chain}
    >
      <List
        chain={chain}
        category={"Externals"}
        create={null}
        items={items}
        pagination={{
          page: proposals.page,
          pageSize: proposals.pageSize,
          total: proposals.total,
        }}
        type="democracy"
      />
    </LayoutFixedHeader>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { page, chain, page_size: pageSize } = context.query;

  const [{ result: proposals }] = await Promise.all([
    nextApi.fetch(`${chain}/democracy/externals`, {
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
