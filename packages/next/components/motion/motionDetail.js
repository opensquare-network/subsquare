import { cloneDeep } from "lodash-es";
import ArticleContent from "next-common/components/articleContent";
import { useCallback, useEffect, useMemo, useState } from "react";
import Vote from "./vote";
import { useMountedState } from "react-use";
import { isMotionEnded } from "next-common/utils";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import Chains from "next-common/utils/consts/chains";
import usePrime from "next-common/utils/hooks/usePrime";
import PostEdit from "next-common/components/post/postEdit";
import { usePost, usePostDispatch } from "next-common/context/post";
import fetchAndUpdatePost from "next-common/context/post/update";
import { useChain } from "next-common/context/chain";
import { useDetailType } from "next-common/context/page";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import useSetEdit from "next-common/components/detail/common/hooks/useSetEdit";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import MotionHead from "./head";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import { useCouncilMotionBusinessData } from "next-common/hooks/useCouncilMotionBusinessData";
import { useContextApi } from "next-common/context/api";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { useCollectivePallet } from "next-common/context/collective";

const Business = dynamicClientOnly(() => import("./business"));

const Metadata = dynamicClientOnly(() => import("./metadata"));

const Timeline = dynamicClientOnly(() => import("./timeline"));

const CollectiveCall = dynamicClientOnly(() =>
  import("next-common/components/collective/call"),
);

export default function MotionDetail() {
  const type = useDetailType();
  const chain = useChain();
  const postDispatch = usePostDispatch();
  const api = useContextApi();
  const isMounted = useMountedState();
  const post = usePost();
  const motionBusinessData = useCouncilMotionBusinessData();

  useSubscribePostDetail(`${post?.height}_${post?.hash}`);

  const pallet = useCollectivePallet();
  const votingMethod = api?.query?.[pallet]?.voting;
  const isEdit = useSelector(isEditingPostSelector);
  const setIsEdit = useSetEdit();

  const motionEnd = isMotionEnded(post.onchainData);

  const blockHash = motionEnd
    ? post.onchainData?.state?.indexer?.blockHash
    : null;
  const prime = usePrime(blockHash);
  const singleApprovalMotion = post.onchainData.threshold === 1;

  const dbVotes = useMemo(() => {
    if (!post?.onchainData) {
      return [];
    }

    if (singleApprovalMotion) {
      return [[post.onchainData.authors[0], true]];
    }

    const timeline = post.onchainData.timeline || [];
    const rawVoters = timeline
      .filter((item) => item.method === "Voted")
      .map((item) => [item.args.voter, item.args.approve]);
    // special data, in kusama before motion 345, proposer has a default aye vote
    if (
      (Chains.kusama === chain && post.onchainData.index < 345) ||
      (Chains.polkadot === chain && post.onchainData.index <= 107)
    ) {
      const proposed = timeline.find((item) => item.method === "Proposed");
      rawVoters.unshift([proposed.args.proposer, true]);
    }
    return Array.from(new Map(rawVoters));
  }, [post, chain, singleApprovalMotion]);

  const [votes, setVotes] = useState(dbVotes);
  const [readOnchainVotes, setReadOnchainVotes] = useState(Date.now());
  const [isLoadingVote, setIsLoadingVote] = useState(false);

  useEffect(() => {
    if (!votingMethod || !readOnchainVotes || singleApprovalMotion) {
      return;
    }

    setIsLoadingVote(true);

    votingMethod(post.onchainData.hash)
      .then((voting) => {
        const jsonVoting = voting.toJSON();
        if (!jsonVoting) {
          return;
        }

        const newVotes = cloneDeep(dbVotes);
        jsonVoting.ayes?.map((voter) => {
          const vote = newVotes.find((item) => item[0] === voter);
          if (!vote) {
            newVotes.push([voter, true]);
          } else {
            vote[1] = true;
          }
        });
        jsonVoting.nays?.map((voter) => {
          const vote = newVotes.find((item) => item[0] === voter);
          if (!vote) {
            newVotes.push([voter, false]);
          } else {
            vote[1] = false;
          }
        });

        if (isMounted()) {
          setVotes(newVotes);
        }
      })
      .finally(() => setIsLoadingVote(false));
  }, [
    votingMethod,
    readOnchainVotes,
    post,
    dbVotes,
    isMounted,
    singleApprovalMotion,
  ]);

  const updateVotes = useCallback(() => {
    setReadOnchainVotes(Date.now());
  }, []);

  const refreshPageData = () =>
    fetchAndUpdatePost(postDispatch, type, post._id);

  if (isEdit) {
    return <PostEdit setIsEdit={setIsEdit} updatePost={refreshPageData} />;
  }

  return (
    <>
      <DetailContentBase>
        {!isEdit && <MotionHead motion={post} type={type} />}
        <ArticleContent className="mt-6" setIsEdit={setIsEdit} />
      </DetailContentBase>
      <Vote
        votes={votes}
        prime={prime}
        motionHash={post.hash}
        motionIndex={post.motionIndex}
        onInBlock={updateVotes}
        isLoadingVote={isLoadingVote}
      />
      <DetailMultiTabs
        call={
          post?.onchainData?.proposal && (
            <CollectiveCall call={post.onchainData.proposal} />
          )
        }
        business={
          !!motionBusinessData?.length && (
            <Business motion={post?.onchainData} />
          )
        }
        metadata={<Metadata />}
        timeline={<Timeline />}
      />
    </>
  );
}
