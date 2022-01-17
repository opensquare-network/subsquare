import List from "components/list";
import Menu from "components/menu";
import { mainMenu } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import styled from "styled-components";
import PlusIcon from "public/imgs/icons/plusInCircle.svg";
import Layout from "components/layout";
import { toDiscussionListItem } from "utils/viewfuncs";
import SEO from "components/SEO";
import { isSafari } from "../utils/serverSideUtil";

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

export default withLoginUserRedux(({ loginUser, posts, chain, siteUrl }) => {
  const items = (posts.items || []).map((item) =>
    toDiscussionListItem(chain, item)
  );

  const create = (
    <Create href="post/create">
      <PlusIcon />
      New Post
    </Create>
  );

  return (
    <Layout
      user={loginUser}
      left={<Menu menu={mainMenu} chain={chain} />}
      chain={chain}
    >
      <SEO
        title={`Discussions`}
        desc={`Discussions`}
        siteUrl={siteUrl}
        chain={chain}
      />
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
  isSafari(context);
  const [{ result: posts }] = await Promise.all([
    nextApi.fetch(`posts`, { page: page ?? 1, pageSize: pageSize ?? 50 }),
  ]);

  return {
    props: {
      chain,
      posts: posts ?? EmptyList,
      siteUrl: process.env.SITE_URL,
    },
  };
});
