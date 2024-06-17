import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import {
  fetchDetailComments,
  getPostVotesAndMine,
} from "next-common/services/detail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import PostDetail from "next-common/components/detail/postDetail";

export default function PostDetailPage({ detail }) {
  const desc = getMetaDesc(detail);
  return (
    <PostProvider post={detail}>
      <DetailLayout
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
      >
        <PostDetail />
      </DetailLayout>
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;

  const { result: detail } = await nextApi.fetch(`posts/${id}`);

  if (!detail) {
    return to404();
  }
  const tracksProps = await fetchOpenGovTracksProps();

  if (detail.dataSource === "sima") {
    const { page, page_size: pageSize } = context.query;

    const comments = await nextApi.fetch(
      `sima/discussions/${detail.cid}/comments`,
      {
        page: page ?? "last",
        pageSize: Math.min(pageSize ?? 50, 100),
      },
    );

    return {
      props: {
        detail,
        comments: comments ?? EmptyList,
        ...tracksProps,
      },
    };
  }

  const comments = await fetchDetailComments(
    `posts/${detail._id}/comments`,
    context,
  );
  const { votes, myVote } = await getPostVotesAndMine(detail, context);

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      votes,
      myVote: myVote ?? null,

      ...tracksProps,
    },
  };
});
