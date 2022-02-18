import styled from "styled-components";
import cloneDeep from "lodash.clonedeep";
import { shadow_100 } from "../../styles/componentCss";
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
import { useApi } from "utils/hooks";
import toApiCouncil from "./toApiCouncil";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
  border-radius: 6px;
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
    border-radius: 0;
  }

  :hover {
    .edit {
      display: block;
    }
  }
`;

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
      const voting = post.onchainData.voting;
      if (voting) {
        return post.onchainData.timeline
          .filter((item) => item.method === "Voted")
          .map((item) => [item.args.voter, item.args.approve]);
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

  return (
    <div>
      <Wrapper>
        {!isEdit && <Head motion={post} chain={chain} />}
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
      </Wrapper>
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
