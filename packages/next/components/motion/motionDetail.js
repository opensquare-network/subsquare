import ArticleContent from "next-common/components/articleContent";
import { useMemo, useState } from "react";
import Vote from "./vote";
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
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";

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
  const post = usePost();
  const motionBusinessData = useCouncilMotionBusinessData();

  useSubscribePostDetail(`${post?.height}_${post?.hash}`);

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

  const [votes] = useState(dbVotes);

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
