import List from "components/list";
import Layout from "components/layout";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "../../lib";
import nextApi from "../../services/nextApi";
import { EmptyList } from "../../utils/constants";
import styled from "styled-components";
import PlusIcon from "../../public/imgs/icons/plusInCircle.svg";
import LayoutFixedHeader from "../../components/layoutFixedHeader";

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

export default withLoginUserRedux(({loginUser, posts, chain}) => {
  const items = (posts.items || []).map((post) => ({
    title: "batchAll",
    type: "Democracy",
    status: "Proposed",
    author: post.author,
    postUid: post.postUid,
    commentsCount: 1,
    remaining: 3661,
    index: 1,
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
        category={"Referenda"}
        create={create}
        items={items}
        pagination={{
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
      />
    </LayoutFixedHeader>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const {page, chain, page_size: pageSize} = context.query;

  const [{result: posts}] = await Promise.all([
    nextApi.fetch(`${chain}/posts`, {page, pageSize: pageSize ?? 50}),
  ]);

  return {
    props: {
      chain,
      posts: posts ?? EmptyList,
    },
  };
});
