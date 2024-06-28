import {
  PostProvider,
  useOnchainData,
  usePost,
} from "next-common/context/post";
import { withCommonProps } from "next-common/lib";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import Gov2Sidebar from "components/gov2/sidebar";
import nextApi from "next-common/services/nextApi";
import {
  gov2ReferendumsCommentApi,
  gov2ReferendumsDetailApi,
  gov2ReferendumsVoteStatsApi,
} from "next-common/services/url";
import Timeline from "components/gov2/timeline";
import Gov2ReferendumMetadata from "next-common/components/gov2/referendum/metadata";
import { useEffect } from "react";
import { EmptyList } from "next-common/utils/constants";
import Breadcrumb from "next-common/components/_Breadcrumb";
import { unsetIssuance } from "next-common/store/reducers/gov2ReferendumSlice";
import { useDispatch } from "react-redux";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import CheckUnFinalized from "components/gov2/checkUnFinalized";
import ReferendaBreadcrumb from "next-common/components/referenda/breadcrumb";
import ReferendaDetail from "next-common/components/detail/referenda";
import useSubReferendumInfo from "next-common/hooks/referenda/useSubReferendumInfo";
import { useReferendumInfo } from "next-common/hooks/referenda/useReferendumInfo";
import { clearVotes } from "next-common/store/reducers/referenda/votes";
import DetailLayout from "next-common/components/layout/DetailLayout";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import Gov2ReferendumCall from "next-common/components/gov2/referendum/call";
import Gov2ReferendaVotesBubble from "next-common/components/gov2/referendum/votesBubble";
import ProposalAddress from "next-common/components/statistics/referenda/proposalAddress";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { usePageProps } from "next-common/context/page";
import useFetchVotes from "next-common/utils/gov2/useFetchVotes";
import SimaReferendumContent from "components/referenda/sima/referendaContent";

function ReferendumContent() {
  const post = usePost();

  const dispatch = useDispatch();
  useSubReferendumInfo();
  const info = useReferendumInfo();
  const onchainData = useOnchainData();
  useFetchVotes(onchainData);
  const proposal = onchainData?.proposal ?? {};

  useEffect(() => {
    return () => {
      dispatch(unsetIssuance());
      dispatch(clearVotes());
    };
  }, [dispatch]);

  return (
    <ContentWithComment>
      <ReferendaDetail />

      <Gov2Sidebar />

      <DetailMultiTabs
        call={proposal?.call && <Gov2ReferendumCall />}
        metadata={<Gov2ReferendumMetadata info={info} />}
        timeline={<Timeline trackInfo={post?.onchainData?.trackInfo} />}
        votesBubble={<Gov2ReferendaVotesBubble />}
        statistics={<ProposalAddress />}
      />
    </ContentWithComment>
  );
}

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
  const post = usePost();
  return (
    <ReferendumPageCommon
      breadcrumbs={<ReferendaBreadcrumb />}
      postContent={
        post?.sima ? <SimaReferendumContent /> : <ReferendumContent />
      }
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
      <ReferendumPageImpl />
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;

  let detail;
  let comments;

  const { result: simaDetail } = await nextApi.fetch(`sima/referenda/${id}`);
  if (simaDetail) {
    const { result } = await nextApi.fetch(`sima/referenda/${id}/comments`);

    detail = simaDetail;
    comments = result;
  } else {
    const { result } = await nextApi.fetch(gov2ReferendumsDetailApi(id));
    if (!result) {
      return getNullDetailProps(id, { voteStats: {} });
    }

    detail = result;
    comments = await fetchDetailComments(
      gov2ReferendumsCommentApi(detail?._id),
      context,
    );
  }

  const { result: voteStats } = await nextApi.fetch(
    gov2ReferendumsVoteStatsApi(id),
  );
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      detail,
      voteStats: voteStats ?? {},
      comments: comments ?? EmptyList,

      ...tracksProps,
    },
  };
});
