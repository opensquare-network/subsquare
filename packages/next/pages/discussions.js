import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import ListLayout from "next-common/components/layout/ListLayout";
import { useChain } from "next-common/context/chain";
import normalizeDiscussionListItem from "next-common/utils/viewfuncs/discussion/normalizeDiscussionListItem";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import { SystemPlus } from "@osn/icons/subsquare";
import { useRouter } from "next/router";

export default withLoginUserRedux(({ posts }) => {
  const chain = useChain();
  const router = useRouter();
  const items = (posts.items || []).map((item) =>
    normalizeDiscussionListItem(chain, item),
  );

  const category = "Discussions";
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      summaryFooter={
        <div className="flex justify-end">
          <PrimaryButton
            small
            icon={
              <SystemPlus className="w-4 h-4 [&_path]:fill-textPrimaryContrast" />
            }
            onClick={() => router.push("/posts/create")}
          >
            New Post
          </PrimaryButton>
        </div>
      }
    >
      <PostList
        category={category}
        title="List"
        titleCount={posts.total}
        items={items}
        pagination={{
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
      />
    </ListLayout>
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
