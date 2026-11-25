import React from "react";
import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { isNumericId } from "next-common/utils/routeParams";
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
import TreasurySpendPayout from "next-common/components/detail/treasury/spend/payout";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import {
  TreasuryProvider,
  useTreasuryPapiPallet,
} from "next-common/context/treasury";
import MaybeSimaContent from "next-common/components/detail/maybeSimaContent";
import TreasurySpendsDetailMultiTabs from "next-common/components/pages/components/tabs/treasurySpendsDetailMultiTabs";
import { PapiProvider } from "next-common/context/papi";
import DemoPapiProvider from "next-common/components/treasury/spends/payout/demoPapiProvider";
import { usePayoutQueueIsDemo } from "next-common/components/treasury/spends/payout/sourceContext";
import { getDemoSpendPost } from "next-common/components/treasury/spends/payout/demoData";

const demoEnabled = process.env.NEXT_PUBLIC_PAYOUT_QUEUE_DEMO === "true";

function TreasurySpendContent() {
  const detail = usePost();
  const isDemo = usePayoutQueueIsDemo();
  // Demo posts are static, there is no backend document to poll
  useSubscribePostDetail(isDemo ? null : detail?.index);

  const content = (
    <>
      <TreasurySpendDetail />
      <TreasurySpendPayout />
      <TreasurySpendsDetailMultiTabs />
    </>
  );

  return (
    <MaybeSimaContent>
      <ContentWithComment>
        {/* The demo provider supplies the mocked chain api */}
        {isDemo ? content : <PapiProvider>{content}</PapiProvider>}
      </ContentWithComment>
    </MaybeSimaContent>
  );
}

function ProposalContentWithNullGuard({ detailApiPath, children }) {
  const { id } = usePageProps();
  const detail = usePost();
  const treasuryPallet = useTreasuryPapiPallet();

  if (!detail) {
    return (
      <CheckUnFinalizedBase
        onChainDataFetcher={async (api, checkPallet) => {
          if (!checkPallet(treasuryPallet, "Spends")) {
            return;
          }

          return api.query[treasuryPallet].Spends.getValue(parseInt(id));
        }}
        serverPostFetcher={() => backendApi.fetch(`${detailApiPath}/${id}`)}
      />
    );
  }

  return children;
}

function SpendPageImpl({ detailApiPath, children }) {
  const seoInfo = useDetailPageSeoInfo();

  return (
    <DetailLayout seoInfo={seoInfo} hasSidebar={true}>
      <ProposalContentWithNullGuard detailApiPath={detailApiPath}>
        {children}
      </ProposalContentWithNullGuard>
    </DetailLayout>
  );
}

export function CommonSpendPageWrapper({
  post,
  pallet,
  detailApiPath,
  children,
}) {
  return (
    <PostProvider post={post}>
      <TreasuryProvider pallet={pallet}>
        <SpendPageImpl detailApiPath={detailApiPath}>{children}</SpendPageImpl>
      </TreasuryProvider>
    </PostProvider>
  );
}

export default function SpendPage({ detail }) {
  const content = (
    <CommonSpendPageWrapper
      post={detail}
      pallet="treasury"
      detailApiPath="treasury/spends"
    >
      <TreasurySpendContent />
    </CommonSpendPageWrapper>
  );

  return demoEnabled ? <DemoPapiProvider>{content}</DemoPapiProvider> : content;
}

export const getServerSideProps = withCommonProps(
  async (context) => {
    const { id } = context.query;
    const tracksProps = await fetchOpenGovTracksProps();

    if (demoEnabled) {
      const demoDetail = getDemoSpendPost(id);

      // Demo spends are the only source of truth in demo mode, there is no
      // backend or chain document to fall back to
      if (!demoDetail) {
        return { notFound: true };
      }

      return {
        props: {
          detail: demoDetail,
          comments: EmptyList,
          ...tracksProps,
        },
      };
    }

    const { result: detail } = await backendApi.fetch(`treasury/spends/${id}`);

    if (!detail) {
      return getNullDetailProps(id);
    }

    const comments = await fetchDetailComments(
      `treasury/spends/${detail._id}/comments`,
      context,
    );

    return {
      props: {
        detail,
        comments: comments ?? EmptyList,
        ...tracksProps,
      },
    };
  },
  // /treasury/spends/summary is a backend stats endpoint, not a spend.
  { validateParams: { id: isNumericId } },
);
