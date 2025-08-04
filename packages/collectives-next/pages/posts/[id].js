import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import {
  fetchDetailComments,
  getPostVotesAndMine,
} from "next-common/services/detail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import PostDetail from "next-common/components/pages/components/postDetail";
import NotFoundDetail from "next-common/components/notFoundDetail";

export default function PostDetailPage({ detail }) {
  if (!detail) {
    return (
      <NotFoundDetail
        breadcrumbItems={[
          {
            content: "Discussions",
            path: "/discussions",
          },
        ]}
      />
    );
  }
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

  const { result: detail = null } = await backendApi.fetch(`posts/${id}`);

  const tracksProps = await fetchOpenGovTracksProps();
  const { votes, myVote } = await getPostVotesAndMine(detail, context);

  const comments = detail
    ? await fetchDetailComments(`posts/${detail?._id}/comments`, context)
    : null;

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
