import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withCommonProps } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import DiscussionsLayout from "next-common/components/layout/DiscussionsLayout";
import { useChain } from "next-common/context/chain";
import normalizeDiscussionListItem from "next-common/utils/viewfuncs/discussion/normalizeDiscussionListItem";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import { SystemPlus } from "@osn/icons/subsquare";
import { useRouter } from "next/router";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default function DiscussionsPage({ posts }) {
  const chain = useChain();
  const router = useRouter();
  const items = (posts.items || []).map((item) =>
    normalizeDiscussionListItem(chain, item),
  );

  const category = "Discussions";
  const seoInfo = { title: category, desc: category };

  return (
    <DiscussionsLayout
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
    </DiscussionsLayout>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { page, page_size: pageSize, label } = context.query;

  let q = { page: page ?? 1, pageSize: pageSize ?? defaultPageSize };
  if (label) {
    q = { label, ...q };
  }
  const { result: posts } = await nextApi.fetch("posts", q);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      posts: posts ?? EmptyList,
      ...tracksProps,
    },
  };
});
