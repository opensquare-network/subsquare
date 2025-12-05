import DetailItem from "next-common/components/polkassembly/detailItem";
import PolkassemblyComments from "next-common/components/polkassembly/comment";
import { usePolkassemblyPostData } from "next-common/hooks/polkassembly/usePolkassemblyPostData";
import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import NotFoundDetail from "next-common/components/notFoundDetail";
import { PolkassemblyCommentRepliesProvider } from "next-common/hooks/polkassembly/usePolkassemblyCommentReply";

export default function PostDetailPage({ detail }) {
  if (!detail) {
    return (
      <NotFoundDetail
        breadcrumbItems={[
          {
            content: "Polkassembly",
            path: "/polkassembly/discussions",
          },
        ]}
      />
    );
  }
  return <PostsPageImpl detail={detail} />;
}

function PostsPageImpl({ detail }) {
  const polkassemblyId = detail?.polkassemblyId;
  const { comments, postReactions, loadingComments } = usePolkassemblyPostData({
    polkassemblyId,
  });

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
        <DetailItem postReactions={postReactions} />
        <PolkassemblyCommentRepliesProvider
          polkassemblyPostType="discussion"
          polkassemblyId={polkassemblyId}
        >
          <PolkassemblyComments
            isLoading={loadingComments}
            comments={comments}
            paId={polkassemblyId}
          />
        </PolkassemblyCommentRepliesProvider>
      </DetailLayout>
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const [{ result: detail = null }] = await Promise.all([
    backendApi.fetch(`polkassembly-discussions/${id}`),
  ]);

  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      detail,
      ...tracksProps,
    },
  };
});
