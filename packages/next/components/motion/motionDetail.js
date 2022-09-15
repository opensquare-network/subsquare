import cloneDeep from "lodash.clonedeep";
import ArticleContent from "next-common/components/articleContent";
import { useCallback, useEffect, useMemo, useState } from "react";
import Vote from "./vote";
import useCall from "next-common/utils/hooks/useCall";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import Business from "./business";
import Metadata from "./metadata";
import Timeline from "./timeline";
import Head from "./head";
import { isMotionEnded, isSameAddress } from "next-common/utils";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import toApiCouncil from "next-common/utils/toApiCouncil";
import { EditablePanel } from "next-common/components/styled/panel";
import Chains from "next-common/utils/consts/chains";
import usePrime from "next-common/utils/hooks/usePrime";

export default function MotionDetail({ user, motion, onReply, chain, type }) {
  const isMounted = useIsMounted();

  const [post, setPost] = useState(motion);

  useEffect(() => {
    if (isMounted.current) {
      setPost(motion);
    }
  }, [motion, isMounted]);

  const [isEdit, setIsEdit] = useState(false);

  const api = useApi(chain);

  const votingMethod = api?.query?.[toApiCouncil(chain, type)]?.voting;
  const membersMethod = api?.query?.[toApiCouncil(chain, type)]?.members;

  const voters = useCall(membersMethod, [])?.toJSON() || [];
  const userCanVote = voters?.some((address) =>
    isSameAddress(user?.address, address)
  );
  const motionEnd = isMotionEnded(post.onchainData);

  const blockHash = motionEnd
    ? post.onchainData?.state?.indexer?.blockHash
    : null;
  const prime = usePrime({ blockHash, chain, type });
  const singleApprovalMotion = post.onchainData.threshold === 1;

  const dbVotes = useMemo(() => {
    if (!post?.onchainData) {
      return [];
    }

    if (singleApprovalMotion) {
      return [
        [post.onchainData.authors[0], true]
      ];
    }

    const timeline = post.onchainData.timeline || [];
    const rawVoters = timeline
      .filter((item) => item.method === "Voted")
      .map((item) => [item.args.voter, item.args.approve])
    // special data, in kusama before motion 345, proposer has a default aye vote
    if (Chains.kusama === chain && post.onchainData.index < 345 ||
      Chains.polkadot === chain && post.onchainData.index <= 107
    ) {
      const proposed = timeline.find((item) => item.method === "Proposed");
      rawVoters.unshift([proposed.args.proposer, true]);
    }
    return Array.from(new Map(rawVoters));
  }, [post, chain, singleApprovalMotion]);

  const [votes, setVotes] = useState(dbVotes);
  const [readOnchainVotes, setReadOnchainVotes] = useState(0);
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

        if (isMounted.current) {
          setVotes(newVotes);
        }
      })
      .finally(() => setIsLoadingVote(false));
  }, [votingMethod, readOnchainVotes, post, dbVotes, isMounted, singleApprovalMotion]);

  const updateVotes = useCallback(() => {
    setReadOnchainVotes(Date.now());
  }, []);

  return (
    <div>
      <EditablePanel>
        {!isEdit && <Head motion={post} chain={chain} type={type} />}
        <ArticleContent
          chain={chain}
          post={post}
          setPost={setPost}
          user={user}
          onReply={onReply}
          type={type}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
        />
      </EditablePanel>
      <Vote
        chain={chain}
        votes={votes}
        voters={voters}
        prime={prime}
        userCanVote={userCanVote}
        motionIsFinal={motionEnd}
        motionHash={post.hash}
        motionIndex={post.motionIndex}
        updateVotes={updateVotes}
        isLoadingVote={isLoadingVote}
        onChainData={post.onchainData}
        type={type}
      />
      <Business motion={post?.onchainData} chain={chain} />
      <Metadata motion={post?.onchainData} chain={chain} />
      <Timeline motion={post?.onchainData} chain={chain} />
    </div>
  );
}
