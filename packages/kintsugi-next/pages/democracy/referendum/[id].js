/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import Back from "next-common/components/back";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import DetailItem from "components/detailItem";
import Vote from "components/referenda/vote";
import Timeline from "next-common/components/timeline";
import { to404 } from "next-common/utils/serverSideUtil";
import { getDemocracyTimelineData } from "utils/timeline/democracyUtil";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import ReferendumMetadata from "next-common/components/democracy/metadata";
import useCommentComponent from "next-common/components/useCommentComponent";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";
import extractVoteInfo from "next-common/utils/democracy/referendum";
import { fetchElectorate, fetchVotes, setElectorate } from "next-common/store/reducers/referendumSlice";
import { useDispatch, useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";

export default withLoginUserRedux(
  ({ loginUser, detail, publicProposal, comments, chain }) => {
    const { CommentComponent, focusEditor } = useCommentComponent({
      detail,
      comments,
      loginUser,
      chain,
      type: detailPageCategory.DEMOCRACY_REFERENDUM,
    });

    const { voteInfo: { voteFinished, voteFinishedHeight }, referendumIndex } = detail;
    const api = useApi(chain);
    const [referendumStatus, setReferendumStatus] = useState(
      detail?.onchainData?.status || detail?.onchainData?.info?.ongoing
    );
    const possibleElectorate = referendumStatus?.tally?.electorate;

    const isMounted = useIsMounted();
    const [isLoadingReferendumStatus, setIsLoadingReferendumStatus] =
      useState(false);
    const dispatch = useDispatch();
    const latestHeight = useSelector(latestHeightSelector)

    const proposalData = getDemocracyTimelineData(
      publicProposal?.onchainData?.timeline || [],
      chain,
      detailPageCategory.DEMOCRACY_PROPOSAL
    );
    const referendumData = getDemocracyTimelineData(
      detail?.onchainData?.timeline || [],
      chain,
      detailPageCategory.DEMOCRACY_REFERENDUM
    );
    const timelineData = proposalData.concat(referendumData);

    useEffect(() => {
      if (api) {
        dispatch(fetchVotes(api, referendumIndex, voteFinishedHeight))
      }
    }, [api, dispatch, referendumIndex, voteFinishedHeight])

    useEffect(() => {
      if (possibleElectorate) {
        dispatch(setElectorate(possibleElectorate));
      } else if (api) {
        dispatch(fetchElectorate(api, voteFinishedHeight || latestHeight, possibleElectorate))
      }
    }, [api, dispatch, voteFinishedHeight, latestHeight, possibleElectorate])

    useEffect(() => {
      if (voteFinished) {
        return;
      }

      setIsLoadingReferendumStatus(true);
      api?.query.democracy
        .referendumInfoOf(detail.referendumIndex)
        .then((referendumInfo) => {
          const referendumInfoData = referendumInfo.toJSON();
          if (isMounted.current) {
            setReferendumStatus(referendumInfoData?.ongoing);
          }
        })
        .finally(() => {
          setIsLoadingReferendumStatus(false);
        });
    }, [api, detail, isMounted, voteFinished]);

    detail.status = detail.onchainData?.state?.state;

    const desc = getMetaDesc(detail);
    return (
      <DetailWithRightLayout
        user={loginUser}
        seoInfo={{ title: detail?.title, desc, ogImage: detail?.bannerUrl }}
      >
        <Back href={`/democracy/referendums`} text="Back to Referendas" />
        <DetailItem
          data={detail}
          onReply={focusEditor}
          user={loginUser}
          chain={chain}
          type={detailPageCategory.DEMOCRACY_REFERENDUM}
        />

        <Vote
          referendumInfo={detail?.onchainData?.info}
          referendumStatus={referendumStatus}
          setReferendumStatus={setReferendumStatus}
          chain={chain}
          referendumIndex={detail?.referendumIndex}
          isLoadingReferendumStatus={isLoadingReferendumStatus}
          setIsLoadingReferendumStatus={setIsLoadingReferendumStatus}
        />

        <ReferendumMetadata
          api={api}
          proposer={detail.proposer}
          status={referendumStatus}
          call={detail?.onchainData?.preImage?.call}
          chain={chain}
          onchainData={detail.onchainData}
        />

        <Timeline data={timelineData} chain={chain} />
        {CommentComponent}
      </DetailWithRightLayout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { id, page, page_size: pageSize } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`democracy/referendums/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  let publicProposal = null;
  if ((detail.proposalIndex ?? null) !== null) {
    const result = await nextApi.fetch(
      `democracy/proposals/${detail.proposalIndex}`
    );
    publicProposal = result.result;
  }

  const postId = detail?._id;
  const voteInfo = extractVoteInfo(detail?.onchainData?.timeline)
  Object.assign(detail, { voteInfo });

  const { result: comments } = await nextApi.fetch(
    `democracy/referendums/${postId}/comments`,
    {
      page: page ?? "last",
      pageSize: Math.min(pageSize ?? 50, 100),
    }
  );

  return {
    props: {
      detail: detail ?? {},
      publicProposal,
      comments: comments ?? EmptyList,
      chain,
    },
  };
});
