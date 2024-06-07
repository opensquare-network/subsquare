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
import React from "react";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import TreasurySpendDetail from "next-common/components/detail/treasury/spend";

function TreasurySpendContent() {
  return (
    <ContentWithComment>
      <TreasurySpendDetail />
    </ContentWithComment>
  );
}

function ProposalContentWithNullGuard() {
  const { id } = usePageProps();
  const detail = usePost();

  if (!detail) {
    return (
      <CheckUnFinalizedBase
        onChainDataFetcher={async (api) => api.query.treasury?.spends(id)}
        serverPostFetcher={() => nextApi.fetch(`treasury/spends/${id}`)}
      />
    );
  }

  return <TreasurySpendContent />;
}

function SpendPageImpl() {
  const seoInfo = useDetailPageSeoInfo();

  return (
    <DetailLayout seoInfo={seoInfo}>
      <ProposalContentWithNullGuard />
    </DetailLayout>
  );
}

export default function SpendPage({ detail }) {
  return (
    <PostProvider post={detail}>
      <SpendPageImpl />
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
