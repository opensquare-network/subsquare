import { PostProvider, usePost } from "next-common/context/post";
import { withCommonProps } from "next-common/lib";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import nextApi, { backendApi } from "next-common/services/nextApi";
import {
  gov2ReferendumsCommentApi,
  gov2ReferendumsDetailApi,
  gov2ReferendumsVoteStatsApi,
  gov2TracksApi,
} from "next-common/services/url";
import { EmptyList } from "next-common/utils/constants";
import Breadcrumb from "next-common/components/_Breadcrumb";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import CheckUnFinalized from "components/gov2/checkUnFinalized";
import ReferendaBreadcrumb from "next-common/components/referenda/breadcrumb";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { usePageProps } from "next-common/context/page";
import { ReferendumContent } from "components/referenda/referendaContent";
import { ReferendaPalletProvider } from "next-common/context/referenda/pallet";

function UnFinalizedBreadcrumb({ id }) {
  return (
    <BreadcrumbWrapper>
      <Breadcrumb
        items={[
          {
            path: "/referenda",
            content: "Referenda",
          },
          {
            content: `#${id}`,
          },
        ]}
      />
    </BreadcrumbWrapper>
  );
}

function ReferendumPageCommon({ breadcrumbs, postContent }) {
  const detail = usePost();

  const desc = getMetaDesc(detail);

  const seoInfo = {
    title: detail?.title,
    desc,
    ogImage: getBannerUrl(detail?.bannerCid),
  };

  return (
    <DetailLayout seoInfo={seoInfo} breadcrumbs={breadcrumbs} hasSidebar>
      {postContent}
    </DetailLayout>
  );
}

function ReferendumNullPage() {
  const { id } = usePageProps();
  return (
    <ReferendumPageCommon
      breadcrumbs={<UnFinalizedBreadcrumb id={id} />}
      postContent={<CheckUnFinalized id={id} />}
    />
  );
}

function ReferendumPageWithPost() {
  return (
    <ReferendumPageCommon
      breadcrumbs={<ReferendaBreadcrumb />}
      postContent={<ReferendumContent />}
    />
  );
}

function ReferendumPageImpl() {
  const detail = usePost();

  if (!detail) {
    return <ReferendumNullPage />;
  }

  return <ReferendumPageWithPost />;
}

export default function ReferendumPage({ detail }) {
  return (
    <PostProvider post={detail}>
      <ReferendaPalletProvider pallet="referenda">
        <ReferendumPageImpl />
      </ReferendaPalletProvider>
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;

  const { result: detail } = await backendApi.fetch(
    gov2ReferendumsDetailApi(id),
  );
  if (!detail) {
    return getNullDetailProps(id, { voteStats: {} });
  }

  const comments = await fetchDetailComments(
    gov2ReferendumsCommentApi(detail?._id),
    context,
  );

  const { result: voteStats } = await backendApi.fetch(
    gov2ReferendumsVoteStatsApi(id),
  );
  const { result: tracksDetail } = await backendApi.fetch(gov2TracksApi);

  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      detail,
      voteStats: voteStats ?? {},
      comments: comments ?? EmptyList,
      tracksDetail: tracksDetail ?? null,

      ...tracksProps,
    },
  };
});
