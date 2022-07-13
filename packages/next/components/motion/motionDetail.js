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
import { isMotionEnded } from "next-common/utils";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import toApiCouncil from "next-common/utils/toApiCouncil";
import { EditablePanel } from "next-common/components/styled/panel";
import Chains from "next-common/utils/consts/chains";
import usePrime from "next-common/utils/hooks/usePrime";

export default function MotionDetail({ user, motion, onReply, chain, type }) {
  const isMounted = useIsMounted();

  const [post, setPost] = useState(motion);
  const [isEdit, setIsEdit] = useState(false);

  const api = useApi(chain);

  const votingMethod = api?.query?.[toApiCouncil(chain, type)]?.voting;
  const membersMethod = api?.query?.[toApiCouncil(chain, type)]?.members;

  const voters = useCall(membersMethod, [])?.toJSON() || [];
  const userCanVote = voters?.some((address) =>
    user?.addresses?.some(
      (item) => item.address === address && item.chain === chain
    )
  );
  console.log({ voters, user, userCanVote })
  const motionEnd = isMotionEnded(post.onchainData);

  const blockHash = motionEnd ? post.onchainData?.state?.indexer?.blockHash : null;
  const prime = usePrime({ blockHash, chain, type });

  const dbVotes = useMemo(() => {
    if (post?.onchainData) {
      // When there is only one council member, the motion executed immediately
      // No "voting" field, and no "Voted" event in timeline
      const hasVoted = (post.onchainData.timeline || []).some(
        (item) => item.method === "Voted"
      );
      if (hasVoted) {
        const timeline = post.onchainData.timeline || [];
        const voters = Array.from(
          new Map(
            timeline
              .filter((item) => item.method === "Voted")
              .map((item) => [item.args.voter, item.args.approve])
          )
        );

        // special data, in kusama before motion 345, proposer has a default aye vote
        if (Chains.kusama === chain && post.onchainData.index < 345) {
          const proposed = timeline.find((item) => item.method === "Proposed");
          voters.unshift([proposed.args.proposer, true]);
        }

        return voters;
      }

      return [[post.onchainData.proposer, true]];
    }

    return [];
  }, [post, chain]);

  const [votes, setVotes] = useState(dbVotes);
  const [readOnchainVotes, setReadOnchainVotes] = useState(0);
  const [isLoadingVote, setIsLoadingVote] = useState(false);

  useEffect(() => {
    if (!votingMethod || !readOnchainVotes) {
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
  }, [votingMethod, readOnchainVotes, post, dbVotes, isMounted]);

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
        type={type}
      />
      <Business motion={post?.onchainData} chain={chain} />
      <Metadata motion={post?.onchainData} chain={chain} />
      <Timeline motion={post?.onchainData} chain={chain} type={type} />
    </div>
  );
}
