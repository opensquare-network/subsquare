import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider, usePost } from "next-common/context/post";
import MultiAssetChildBountyDetail from "next-common/components/detail/treasury/multiAssetChildBounty";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import MultiAssetChildBountySidebar from "next-common/components/pages/components/multiAssetChildBounty/sidebar";
import { OffChainArticleActionsProvider } from "next-common/noSima/context/articleActionsProvider";
import { OffChainCommentActionsProvider } from "next-common/noSima/context/commentActionsProvider";
import { TreasuryProvider } from "next-common/context/treasury";
import MultiAssetChildBountiesDetailMultiTabs from "next-common/components/pages/components/tabs/multiAssetChildBountiesDetailMultiTabs";

function MultiAssetChildBountyContent() {
  const detail = usePost();
  const parentBountyId = detail?.parentBountyId;
  const index = detail?.index;

  useSubscribePostDetail(
    `${parentBountyId}_${index}_${detail?.indexer?.blockHeight}`,
  );

  return (
    <OffChainArticleActionsProvider>
      <OffChainCommentActionsProvider>
        <ContentWithComment>
          <MultiAssetChildBountyDetail />
          <MultiAssetChildBountySidebar />
          <MultiAssetChildBountiesDetailMultiTabs />
        </ContentWithComment>
      </OffChainCommentActionsProvider>
    </OffChainArticleActionsProvider>
  );
}

function MultiAssetChildBountyContentWithNullGuard() {
  const detail = usePost();

  if (!detail) {
    return null;
  }

  return <MultiAssetChildBountyContent />;
}

function MultiAssetChildBountyPageImpl() {
  const post = usePost();
  const desc = getMetaDesc(post);
  const hasSidebar = !!(
    post?.onchainData?.address ||
    post?.onchainData?.curator ||
    post?.onchainData?.beneficiary
  );

  return (
    <DetailLayout
      seoInfo={{
        title: post?.title,
        desc,
        ogImage: getBannerUrl(post?.bannerCid),
      }}
      hasSidebar={hasSidebar}
    >
      <MultiAssetChildBountyContentWithNullGuard />
    </DetailLayout>
  );
}

export default function MultiAssetChildBountyPage({ detail }) {
  return (
    <PostProvider post={detail}>
      <TreasuryProvider>
        <MultiAssetChildBountyPageImpl />
      </TreasuryProvider>
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const [{ result: detail }, tracksProps] = await Promise.all([
    backendApi.fetch(`treasury/multi-asset-child-bounties/${id}`),
    fetchOpenGovTracksProps(),
  ]);

  if (!detail) {
    return getNullDetailProps(id, {});
  }

  const comments = await fetchDetailComments(
    `treasury/multi-asset-child-bounties/${detail._id}/comments`,
    context,
  );

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      ...tracksProps,
    },
  };
});
