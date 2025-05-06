import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider, usePost } from "next-common/context/post";
import CheckUnFinalized from "next-common/components/treasury/proposal/checkUnFinalized";
import AstarTreasuryProposalDetail from "next-common/components/detail/treasury/proposal/astar/astarTreasuryProposalDetail";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { usePageProps } from "next-common/context/page";
import { OffChainArticleActionsProvider } from "next-common/noSima/context/articleActionsProvider";
import { OffChainCommentActionsProvider } from "next-common/noSima/context/commentActionsProvider";

import { useChainSettings } from "next-common/context/chain";
import { SimaProposalCommentActionsProvider } from "next-common/sima/components/common/context/commentActionsProvider";
import { SimaProposalArticleActionsProvider } from "next-common/sima/components/common/context/articleActionsProvider";
import { TreasuryProvider } from "next-common/context/treasury";
import CommunityTreasuryProposalsDetailMultiTabs from "components/tabs/communityTreasuryProposalsDetailMultiTabs";

function TreasuryProposalContent() {
  const detail = usePost();

  useSubscribePostDetail(detail?.proposalIndex);

  return (
    <ContentWithComment>
      <AstarTreasuryProposalDetail />
      <CommunityTreasuryProposalsDetailMultiTabs />
    </ContentWithComment>
  );
}

function NonSimaTreasuryProposalContent() {
  return (
    <OffChainArticleActionsProvider>
      <OffChainCommentActionsProvider>
        <TreasuryProposalContent />
      </OffChainCommentActionsProvider>
    </OffChainArticleActionsProvider>
  );
}

function SimaTreasuryProposalContent() {
  return (
    <SimaProposalArticleActionsProvider>
      <SimaProposalCommentActionsProvider>
        <TreasuryProposalContent />
      </SimaProposalCommentActionsProvider>
    </SimaProposalArticleActionsProvider>
  );
}

function ProposalContentWithNullGuard() {
  const { id } = usePageProps();
  const detail = usePost();
  const { sima } = useChainSettings();

  if (!detail) {
    return <CheckUnFinalized id={id} />;
  }

  return sima ? (
    <SimaTreasuryProposalContent />
  ) : (
    <NonSimaTreasuryProposalContent />
  );
}

function ProposalPageImpl() {
  const post = usePost();

  const desc = getMetaDesc(post);

  const seoInfo = {
    title: post?.title,
    desc,
    ogImage: getBannerUrl(post?.bannerCid),
  };

  return (
    <DetailLayout seoInfo={seoInfo}>
      <ProposalContentWithNullGuard />
    </DetailLayout>
  );
}

export default function ProposalPage({ detail }) {
  return (
    <PostProvider post={detail}>
      <TreasuryProvider pallet="communityTreasury">
        <ProposalPageImpl />
      </TreasuryProvider>
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const { result: detail } = await backendApi.fetch(
    `community-treasury/proposals/${id}`,
  );

  if (!detail) {
    return getNullDetailProps(id);
  }

  const comments = await fetchDetailComments(
    `community-treasury/proposals/${detail._id}/comments`,
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
