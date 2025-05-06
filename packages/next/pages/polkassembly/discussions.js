import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withCommonProps } from "next-common/lib";
import nextApi, { backendApi } from "next-common/services/nextApi";
import businessCategory from "next-common/utils/consts/business/category";
import normalizePolkassemblyDiscussionListItem from "next-common/utils/viewfuncs/discussion/normalizePaListItem";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import DiscussionsLayout from "next-common/components/layout/DiscussionsLayout";

export default function DiscussionsPage({ posts, chain }) {
  const items = (posts.items || []).map((item) =>
    normalizePolkassemblyDiscussionListItem(chain, item),
  );

  const category = businessCategory.polkassemblyDiscussions;
  const seoInfo = { title: category, desc: category };

  return (
    <DiscussionsLayout seoInfo={seoInfo} title={category}>
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
  const chain = process.env.CHAIN;
  const { page, page_size: pageSize } = context.query;

  const [{ result: posts }] = await Promise.all([
    backendApi.fetch("polkassembly-discussions", {
      page: page ?? 1,
      pageSize: pageSize ?? defaultPageSize,
    }),
  ]);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      chain,
      posts: posts ?? EmptyList,
      ...tracksProps,
    },
  };
});
