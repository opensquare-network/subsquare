import React, { useEffect, useState } from "react";
import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import DetailItem from "components/detailItem";
import Vote from "components/referenda/vote";
import Timeline from "next-common/components/timeline";
import { getDemocracyTimelineData } from "utils/timeline/democracyUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import ReferendumMetadata from "next-common/components/democracy/metadata";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import useMaybeFetchElectorate from "next-common/utils/hooks/referenda/useMaybeFetchElectorate";
import useFetchVotes from "next-common/utils/hooks/referenda/useFetchVotes";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider, usePost } from "next-common/context/post";
import { useDispatch, useSelector } from "react-redux";
import { isNil } from "lodash-es";
import CheckUnFinalized from "next-common/components/democracy/referendum/checkUnFinalized";
import { clearVotes } from "next-common/store/reducers/democracy/votes";
import useDemocracyVotesFromServer from "next-common/utils/hooks/referenda/useDemocracyVotesFromServer";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import { useIsTimelineCompact } from "next-common/components/detail/detailMultiTabs/timelineModeTabs";
import useInlineCall from "next-common/components/democracy/metadata/useInlineCall";
import ReferendumCall from "next-common/components/democracy/call";
import DemocracyReferendaVotesBubble from "components/referenda/votesBubble";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { usePageProps } from "next-common/context/page";
import useSubDemocracyReferendumStatus from "next-common/hooks/democracy/useSubDemocracyReferendumStatus";
import useSetReferendumStatus from "next-common/hooks/democracy/useSetReferendumStatus";
import { referendumStatusSelector } from "next-common/store/reducers/referendumSlice";
import { useContextApi } from "next-common/context/api";
import MaybeSimaContent from "next-common/components/detail/maybeSimaContent";

function ReferendumContent() {
  const dispatch = useDispatch();
  const post = usePost();
  const { publicProposal } = usePageProps();

  useSubscribePostDetail(post?.referendumIndex);
  useSetReferendumStatus();
  useSubDemocracyReferendumStatus(post?.referendumIndex);

  const api = useContextApi();
  const referendumStatus = useSelector(referendumStatusSelector);
  const proposal = referendumStatus?.proposal;

  useMaybeFetchElectorate(post?.onchainData, api);
  useDemocracyVotesFromServer(post.referendumIndex);
  useFetchVotes(post?.onchainData);

  useEffect(() => {
    return () => dispatch(clearVotes());
  }, [dispatch]);

  const [timelineData, setTimelineData] = useState([]);
  useEffect(() => {
    const proposalTimeline = publicProposal?.onchainData?.timeline || [];
    const referendumTimeline = post?.onchainData?.timeline || [];
    setTimelineData([
      ...getDemocracyTimelineData(
        proposalTimeline,
        detailPageCategory.DEMOCRACY_PROPOSAL,
      ),
      ...getDemocracyTimelineData(
        referendumTimeline,
        detailPageCategory.DEMOCRACY_REFERENDUM,
      ),
    ]);
  }, [publicProposal, post]);

  const { call: inlineCall } = useInlineCall(timelineData, proposal);
  const call = post?.onchainData?.preImage?.call || inlineCall;

  const isTimelineCompact = useIsTimelineCompact();

  return (
    <MaybeSimaContent>
      <ContentWithComment>
        <DetailItem />

        <Vote
          referendumInfo={post?.onchainData?.info}
          referendumIndex={post?.referendumIndex}
        />

        <DetailMultiTabs
          call={
            (call || inlineCall) && (
              <ReferendumCall
                call={call || inlineCall}
                shorten={post?.onchainData?.preImage?.shorten}
                onchainData={post?.onchainData}
              />
            )
          }
          metadata={
            <ReferendumMetadata
              proposer={post?.proposer || (post.authors || [])[0]}
              status={referendumStatus ?? {}}
              onchainData={post?.onchainData}
            />
          }
          timeline={
            <Timeline data={timelineData} compact={isTimelineCompact} />
          }
          timelineCount={timelineData.length}
          votesBubble={<DemocracyReferendaVotesBubble />}
        />
      </ContentWithComment>
    </MaybeSimaContent>
  );
}

function ReferendumContentWithNullGuard() {
  const post = usePost();
  const { id } = usePageProps();

  if (!post) {
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
      <ReferendumContentWithNullGuard />
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
    return getNullDetailProps(id, { publicProposal: null });
  }

  let publicProposal;
  if (!isNil(detail.proposalIndex)) {
    const { result } = await nextApi.fetch(
      `democracy/proposals/${detail.proposalIndex}`,
    );
    publicProposal = result;
  }

  const comments = await fetchDetailComments(
    `democracy/referendums/${detail?._id}/comments`,
    context,
  );

  const { result: summary } = await nextApi.fetch("summary");

  return {
    props: {
      id,
      detail: detail ?? null,
      publicProposal: publicProposal ?? null,
      comments: comments ?? EmptyList,
      summary: summary ?? {},
    },
  };
});
