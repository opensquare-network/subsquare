import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { EmptyList } from "next-common/utils/constants";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Timeline from "components/tip/timeline";
import Metadata from "components/tip/metadata";
import Tipper from "components/tipper";
import useUniversalComments from "components/universalComments";
import { getBannerUrl } from "next-common/utils/banner";
import { hashEllipsis } from "next-common/utils";
import { PostProvider, usePost } from "next-common/context/post";
import CheckUnFinalized from "components/tip/checkUnFinalized";
import NonNullPost from "next-common/components/nonNullPost";
import TipDetail from "next-common/components/detail/treasury/tip";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import DetailLayout from "next-common/components/layout/DetailLayout";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { fetchDetailComments } from "next-common/services/detail";

function TreasuryTipContent({ comments }) {
  const post = usePost();
  useSubscribePostDetail(`${post?.height}_${post?.hash}`);

  const { CommentComponent, focusEditor } = useUniversalComments({
    detail: post,
    comments,
  });

  return (
    <>
      <TipDetail onReply={focusEditor} />
      <Tipper />
      <DetailMultiTabs
        metadata={<Metadata tip={post?.onchainData} />}
        timeline={<Timeline tip={post?.onchainData} />}
      />
      {CommentComponent}
    </>
  );
}

export default withLoginUserRedux(({ id, detail, comments }) => {
  let breadcrumbItemName;
  let postContent;

  if (detail) {
    breadcrumbItemName = `#${hashEllipsis(detail?.hash)}`;
    postContent = (
      <NonNullPost>
        <TreasuryTipContent comments={comments} />
      </NonNullPost>
    );
  } else {
    const hash = id?.split("_").pop();
    breadcrumbItemName = `#${hashEllipsis(hash)}`;
    postContent = <CheckUnFinalized id={hash} />;
  }

  const desc = getMetaDesc(detail);

  const breadcrumbItems = [
    {
      content: "Treasury",
    },
    {
      content: "Tips",
      path: "/treasury/tips",
    },
    {
      content: breadcrumbItemName,
    },
  ];

  return (
    <PostProvider post={detail}>
      <DetailLayout
        breadcrumbs={breadcrumbItems}
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
        hasSidebar
      >
        {postContent}
      </DetailLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const { result: detail } = await nextApi.fetch(`treasury/tips/${id}`);

  if (!detail) {
    return {
      props: {
        id,
        detail: null,
        comments: EmptyList,
      },
    };
  }

  //TODO: remove the dirty fix
  detail.authors = detail.authors?.filter((author) =>
    isPolkadotAddress(author),
  );

  const comments = await fetchDetailComments(
    `treasury/tips/${detail._id}/comments`,
    page,
    pageSize,
  );

  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    nextApi.fetch(gov2TracksApi),
    nextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      id,
      detail,
      comments: comments ?? EmptyList,

      tracks,
      fellowshipTracks,
    },
  };
});
