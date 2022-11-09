import PostList from "next-common/components/postList";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import styled from "styled-components";
import PlusIcon from "public/imgs/icons/plusInCircle.svg";
import { toDiscussionListItem } from "utils/viewfuncs";
import HomeLayout from "next-common/components/layout/HomeLayout";

const Create = styled.a`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.primaryPurple500};
  font-size: 14px;
  white-space: nowrap;
  svg {
    margin-right: 8px;
  }
  cursor: pointer;
`;

export default withLoginUserRedux(({ posts, chain }) => {
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
    <HomeLayout seoInfo={seoInfo}>
      <PostList
        category={"Discussions"}
        create={create}
        items={items}
        pagination={{
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
      />
    </HomeLayout>
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
