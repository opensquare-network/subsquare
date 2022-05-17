import List from "next-common/components/list";
import Menu from "next-common/components/menu";
import { EmptyList, mainMenu } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import styled from "styled-components";
import PlusIcon from "public/imgs/icons/plusInCircle.svg";
import Layout from "components/layout";
import { toDiscussionListItem } from "utils/viewfuncs";

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

export default withLoginUserRedux(({ loginUser, posts, chain }) => {
  const items = (posts.items || []).map((item) =>
    toDiscussionListItem(chain, item)
  );

  const create = (
    <Create href="post/create">
      <PlusIcon />
      New Post
    </Create>
  );
  const category = `Discussions`;
  const seoInfo = { title: category, desc: category };

  return (
    <Layout
      user={loginUser}
      left={<Menu menu={mainMenu} chain={chain} />}
      chain={chain}
      seoInfo={seoInfo}
    >
      <List
        chain={chain}
        category={"Discussions"}
        create={create}
        items={items}
        pagination={{
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
      />
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { page, page_size: pageSize } = context.query;
  const [{ result: posts }] = await Promise.all([
    nextApi.fetch(`posts`, { page: page ?? 1, pageSize: pageSize ?? 50 }),
  ]);

  return {
    props: {
      chain,
      posts: posts ?? EmptyList,
    },
  };
});
