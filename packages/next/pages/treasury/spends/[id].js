import React from "react";
import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchDetailComments } from "next-common/services/detail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { EmptyList } from "next-common/utils/constants";
import { PostProvider, usePost } from "next-common/context/post";
import DetailLayout from "next-common/components/layout/DetailLayout";
import useDetailPageSeoInfo from "next-common/hooks/common/useDetailPageSeoInfo";
import { usePageProps } from "next-common/context/page";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import TreasurySpendDetail from "next-common/components/detail/treasury/spend";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import useTreasurySpendTimelineData from "next-common/hooks/treasury/spend/useTreasurySpendTimelineData";
import { useSelector } from "react-redux";
import { detailMultiTabsIsTimelineCompactModeSelector } from "next-common/store/reducers/detailSlice";
import { OffChainArticleActionsProvider } from "next-common/noSima/context/articleActionsProvider";
import { OffChainCommentActionsProvider } from "next-common/noSima/context/commentActionsProvider";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { SimaProposalArticleActionsProvider } from "next-common/sima/components/common/context/articleActionsProvider";
import { SimaProposalCommentActionsProvider } from "next-common/sima/components/common/context/commentActionsProvider";
import { useChainSettings } from "next-common/context/chain";
import TreasurySpendPayout from "next-common/components/detail/treasury/spend/payout";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import { TreasuryProvider } from "next-common/context/treasury";

const TreasurySpendMetadata = dynamicClientOnly(() =>
  import("next-common/components/detail/treasury/spend/metadata"),
);

const Timeline = dynamicClientOnly(() =>
  import("next-common/components/timeline"),
);

function TreasurySpendContent() {
  const detail = usePost();
  const timelineData = useTreasurySpendTimelineData(detail?.onchainData);
  const isTimelineCompact = useSelector(
    detailMultiTabsIsTimelineCompactModeSelector,
  );

  return (
    <ContentWithComment>
      <TreasurySpendDetail />
      <TreasurySpendPayout />
      <DetailMultiTabs
        metadata={<TreasurySpendMetadata spend={detail?.onchainData} />}
        timeline={
          <Timeline
            data={timelineData}
            indent={false}
            compact={isTimelineCompact}
          />
        }
        timelineCount={timelineData.length}
      />
    </ContentWithComment>
  );
}

function NonSimaTreasurySpendContent() {
  return (
    <OffChainArticleActionsProvider>
      <OffChainCommentActionsProvider>
        <TreasurySpendContent />
      </OffChainCommentActionsProvider>
    </OffChainArticleActionsProvider>
  );
}

function SimaTreasurySpendContent() {
  return (
    <SimaProposalArticleActionsProvider>
      <SimaProposalCommentActionsProvider>
        <TreasurySpendContent />
      </SimaProposalCommentActionsProvider>
    </SimaProposalArticleActionsProvider>
  );
}

function ProposalContentWithNullGuard() {
  const { id } = usePageProps();
  const detail = usePost();
  const { sima } = useChainSettings();

  useSubscribePostDetail(detail?.index);

  if (!detail) {
    return (
      <CheckUnFinalizedBase
        onChainDataFetcher={async (api) => api.query.treasury?.spends(id)}
        serverPostFetcher={() => nextApi.fetch(`treasury/spends/${id}`)}
      />
    );
  }

  return sima ? <SimaTreasurySpendContent /> : <NonSimaTreasurySpendContent />;
}

function SpendPageImpl() {
  const seoInfo = useDetailPageSeoInfo();

  return (
    <DetailLayout seoInfo={seoInfo} hasSidebar={true}>
      <ProposalContentWithNullGuard />
    </DetailLayout>
  );
}

export default function SpendPage({ detail }) {
  return (
    <PostProvider post={detail}>
      <TreasuryProvider>
        <SpendPageImpl />
      </TreasuryProvider>
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const { result: detail } = await nextApi.fetch(`treasury/spends/${id}`);

  if (!detail) {
    return getNullDetailProps(id);
  }

  const comments = await fetchDetailComments(
    `treasury/spends/${detail._id}/comments`,
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
