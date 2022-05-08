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
import toApiCouncil from "./toApiCouncil";
import { EditablePanel } from "next-common/components/styled/panel";

export default function MotionDetail({ user, motion, onReply, chain, type }) {
  const isMounted = useIsMounted();

  const [post, setPost] = useState(motion);
  const [isEdit, setIsEdit] = useState(false);

  const api = useApi(chain);

  const votingMethod = api?.query?.[toApiCouncil(chain, type)]?.voting;
  const membersMethod = api?.query?.[toApiCouncil(chain, type)]?.members;

  const voters = useCall(membersMethod, []) || [];
  const userCanVote = voters?.some((address) =>
    user?.addresses?.some(
      (item) => item.address === address && item.chain === chain
    )
  );
  const motionEnd = isMotionEnded(post.onchainData);

  const dbVotes = useMemo(() => {
    if (post?.onchainData) {
      // When there is only one council member, the motion executed immediately
      // No "voting" field, and no "Voted" event in timeline
      const hasVoted = (post.onchainData.timeline || []).some(
        (item) => item.method === "Voted"
      );
      if (hasVoted) {
        return Array.from(
          new Map(
            post.onchainData.timeline
              .filter((item) => item.method === "Voted")
              .map((item) => [item.args.voter, item.args.approve])
          )
        );
      }

      return [[post.onchainData.proposer, true]];
    }

    return [];
  }, [post]);

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

  const external =
    post?.onchainData?.externalProposals?.length === 1
      ? post.onchainData.externalProposals[0]
      : null;

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
