import List from "components/list";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "../../lib";
import nextApi from "../../services/nextApi";
import { EmptyList } from "../../utils/constants";
import styled from "styled-components";
import PlusIcon from "../../public/imgs/icons/plusInCircle.svg";
import LayoutFixedHeader from "../../components/layoutFixedHeader";
import { addressEllipsis } from "utils";

const Create = styled.a`
  display: flex;
  align-items: center;
  color: #6848ff;
  font-size: 14px;
  white-space: nowrap;

  svg {
    margin-right: 8px;
  }

  cursor: pointer;
`;

export default withLoginUserRedux(({loginUser, motions, chain}) => {
  const items = (motions.items || []).map((motion) => ({
    time: motion.indexer.blockTime,
    title: `Motion #${motion.index}: ${motion.proposal.section}.${motion.proposal.method}`,
    type: "Democracy",
    author: motion.author ?? {
      username: addressEllipsis(motion.proposer),
      addresses: [{ chain, address: motion.proposer }],
    },
    height: motion.height,
    hash: motion.hash,
    status: motion.state?.state ?? "Unknown",
    motionIndex: motion.index,
  }));

  const create = (
    <Create href="post/create">
      <PlusIcon/>
      New Post
    </Create>
  );

  return (
    <LayoutFixedHeader user={loginUser} left={<Menu menu={mainMenu}/>} chain={chain}>
      <List
        chain={chain}
        category={"On-chain Motions"}
        create={create}
        items={items}
        pagination={{
          page: motions.page,
          pageSize: motions.pageSize,
          total: motions.total,
        }}
      />
    </LayoutFixedHeader>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const {page, chain, page_size: pageSize} = context.query;

  const [{result: motions}] = await Promise.all([
    nextApi.fetch(`${chain}/motions`, {page, pageSize: pageSize ?? 50}),
  ]);

  return {
    props: {
      chain,
      motions: motions ?? EmptyList,
    },
  };
});
