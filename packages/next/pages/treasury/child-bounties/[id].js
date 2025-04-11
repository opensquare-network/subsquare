import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import ChildBountySidebar from "components/childBounty/sidebar";
import { PostProvider, usePost } from "next-common/context/post";
import CheckUnFinalized from "components/childBounty/checkUnFinalized";
import ChildBountyDetail from "next-common/components/detail/treasury/childBounty";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { usePageProps } from "next-common/context/page";
import { OffChainArticleActionsProvider } from "next-common/noSima/context/articleActionsProvider";
import { OffChainCommentActionsProvider } from "next-common/noSima/context/commentActionsProvider";
import { TreasuryProvider } from "next-common/context/treasury";
import { useOnchainData } from "next-common/context/post";
import TreasuryChildBountiesDetailMultiTabs from "components/tabs/treasuryChildBountiesDetailMultiTabs";

function ChildBountyContent() {
  const post = usePost();
  useSubscribePostDetail(post?.index);

  return (
    <OffChainArticleActionsProvider>
      <OffChainCommentActionsProvider>
        <ContentWithComment>
          <ChildBountyDetail />
          <ChildBountySidebar />
          <TreasuryChildBountiesDetailMultiTabs />
        </ContentWithComment>
      </OffChainCommentActionsProvider>
    </OffChainArticleActionsProvider>
  );
}

function ChildBountyContentWithNullGuard() {
  const detail = usePost();
  const { id } = usePageProps();

  if (!detail) {
    return <CheckUnFinalized id={id} />;
  }

  return <ChildBountyContent />;
}

function ChildBountyPageImpl() {
  const post = usePost();
  const { address } = useOnchainData();

  const desc = getMetaDesc(post);
  const showRightSidePanel =
    address ||
    ["PendingPayout", "Claimed"].includes(post?.onchainData?.state?.state);

  return (
    <DetailLayout
      seoInfo={{
        title: post?.title,
        desc,
        ogImage: getBannerUrl(post?.bannerCid),
      }}
      hasSidebar={showRightSidePanel}
    >
      <ChildBountyContentWithNullGuard />
    </DetailLayout>
  );
}

export default function ChildBountyPage({ detail }) {
  return (
    <PostProvider post={detail}>
      <TreasuryProvider>
        <ChildBountyPageImpl />
      </TreasuryProvider>
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;

  const { result: detail } = await nextApi.fetch(
    `treasury/child-bounties/${id}`,
  );

  if (!detail) {
    return getNullDetailProps(id);
  }

  const comments = await fetchDetailComments(
    `treasury/child-bounties/${detail._id}/comments`,
    context,
  );
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,

      ...tracksProps,
    },
  };
});
