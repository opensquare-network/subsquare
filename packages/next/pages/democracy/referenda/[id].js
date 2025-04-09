import React, { useEffect } from "react";
import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Vote from "components/referenda/vote";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import useMaybeFetchElectorate from "next-common/utils/hooks/referenda/useMaybeFetchElectorate";
import useFetchVotes from "next-common/utils/hooks/referenda/useFetchVotes";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider, usePost } from "next-common/context/post";
import CheckUnFinalized from "next-common/components/democracy/referendum/checkUnFinalized";
import DemocracyReferendaDetail from "next-common/components/detail/Democracy/referendum";
import DetailLayout from "next-common/components/layout/DetailLayout";
import useDemocracyVotesFromServer from "next-common/utils/hooks/referenda/useDemocracyVotesFromServer";
import { clearVotes } from "next-common/store/reducers/democracy/votes";
import { useDispatch, useSelector } from "react-redux";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import useInlineCall from "next-common/components/democracy/metadata/useInlineCall";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { usePageProps } from "next-common/context/page";
import useSubDemocracyReferendumStatus from "next-common/hooks/democracy/useSubDemocracyReferendumStatus";
import useSetReferendumStatus from "next-common/hooks/democracy/useSetReferendumStatus";
import { referendumStatusSelector } from "next-common/store/reducers/referendumSlice";
import { useContextApi } from "next-common/context/api";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import MaybeSimaContent from "next-common/components/detail/maybeSimaContent";
import DemocracyReferendumCallProvider from "next-common/context/democracy/referenda/call";

const Timeline = dynamicClientOnly(() =>
  import("components/referenda/timeline"),
);
const ReferendumMetadata = dynamicClientOnly(() =>
  import("next-common/components/democracy/metadata"),
);
const ReferendumCall = dynamicClientOnly(() =>
  import("next-common/components/democracy/call"),
);
const DemocracyReferendaVotesBubble = dynamicClientOnly(() =>
  import("next-common/components/democracy/referendum/votesBubble"),
);

function ReferendumContent() {
  const post = usePost();

  const onchainData = post?.onchainData;
  const dispatch = useDispatch();

  const { timeline = [], preImage } = onchainData;

  useSubscribePostDetail(post?.referendumIndex);
  useSetReferendumStatus();
  useSubDemocracyReferendumStatus(post?.referendumIndex);

  const api = useContextApi();
  const referendumStatus = useSelector(referendumStatusSelector);
  const proposal = referendumStatus?.proposal;

  const { call: inlineCall } = useInlineCall(timeline, proposal);
  const call = preImage?.call || inlineCall;

  useMaybeFetchElectorate(post?.onchainData, api);
  useDemocracyVotesFromServer(post.referendumIndex);
  useFetchVotes(post?.onchainData);

  useEffect(() => {
    return () => {
      dispatch(clearVotes());
    };
  }, [dispatch]);

  return (
    <MaybeSimaContent>
      <ContentWithComment>
        <DemocracyReferendaDetail />

        <Vote referendumIndex={post?.referendumIndex} />

        <DetailMultiTabs
          call={
            (call || inlineCall) && (
              <DemocracyReferendumCallProvider>
                <ReferendumCall
                  call={call || inlineCall}
                  shorten={post?.onchainData?.preImage?.shorten}
                  onchainData={post?.onchainData}
                />
              </DemocracyReferendumCallProvider>
            )
          }
          metadata={
            <ReferendumMetadata
              proposer={post?.proposer}
              status={referendumStatus ?? {}}
              call={
                post?.onchainData?.preImage?.call || post?.onchainData?.call
              }
              shorten={post?.onchainData?.preImage?.shorten}
              onchainData={post?.onchainData}
            />
          }
          timeline={<Timeline />}
          votesBubble={<DemocracyReferendaVotesBubble />}
        />
      </ContentWithComment>
    </MaybeSimaContent>
  );
}

function ReferendumContentContentWithNullGuard() {
  const detail = usePost();
  const { id } = usePageProps();

  if (!detail) {
    return <CheckUnFinalized id={id} />;
  }

  return <ReferendumContent />;
}

function DemocracyReferendumPageImpl() {
  const detail = usePost();

  const desc = getMetaDesc(detail);

  const seoInfo = {
    title: detail?.title,
    desc,
    ogImage: getBannerUrl(detail?.bannerCid),
  };

  return (
    <DetailLayout seoInfo={seoInfo} hasSidebar>
      <ReferendumContentContentWithNullGuard />
    </DetailLayout>
  );
}

export default function DemocracyReferendumPage({ detail }) {
  return (
    <PostProvider post={detail}>
      <DemocracyReferendumPageImpl />
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;

  const { result: detail } = await nextApi.fetch(`democracy/referendums/${id}`);
  if (!detail) {
    return getNullDetailProps(id);
  }

  const comments = await fetchDetailComments(
    `democracy/referendums/${detail?._id}/comments`,
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
