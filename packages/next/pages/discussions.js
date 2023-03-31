import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import styled from "styled-components";
import PlusIcon from "public/imgs/icons/plusInCircle.svg";
import HomeLayout from "next-common/components/layout/HomeLayout";
import { useChain } from "next-common/context/chain";
import normalizeDiscussionListItem from "next-common/utils/viewfuncs/discussion/normalizeDiscussionListItem";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";

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

export default withLoginUserRedux(({ posts, tracks, fellowshipTracks }) => {
  const chain = useChain();
  const items = (posts.items || []).map((item) =>
    normalizeDiscussionListItem(chain, item)
  );

  const create = (
    <Create href="post/create">
      <PlusIcon />
      New Post
    </Create>
  );
  const category = "Discussions";
  const seoInfo = { title: category, desc: category };

  return (
    <HomeLayout
      seoInfo={seoInfo}
      tracks={tracks}
      fellowshipTracks={fellowshipTracks}
    >
      <PostList
        category={category}
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
  const { page, page_size: pageSize, label } = context.query;

  let q = { page: page ?? 1, pageSize: pageSize ?? defaultPageSize };
  if (label) {
    q = { label, ...q };
  }
  const { result: posts } = await nextApi.fetch("posts", q);

  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    nextApi.fetch(gov2TracksApi),
    nextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      posts: posts ?? EmptyList,
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
