import List from "./list";
import dayjs from "dayjs";
import styled from "styled-components";
import { useEffect, useState } from "react";
import Api from "next-common/services/api";
import { hasDefinedOffChainVoting } from "next-common/utils/summaryExternalInfo";

const space = process.env.NEXT_PUBLIC_OFF_CHAIN_SPACE;

const NewProposal = styled.a`
  cursor: pointer;
  background: linear-gradient(270deg, #04d2c5 0%, #6848ff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

function NoProposals({ host }) {
  return (
    <div className="flex gap-[8px] text-textTertiary text12Medium">
      <span>No active off-chain voting</span>
      <NewProposal
        className="text12Bold"
        target="_blank"
        href={`${host}/space/${process.env.NEXT_PUBLIC_OFF_CHAIN_SPACE}/create`}
      >
        + New Proposal
      </NewProposal>
    </div>
  );
}

function VotingProposals({ host }) {
  const [posts, setPosts] = useState();
  useEffect(() => {
    new Api(host)
      .fetch(`/api/${space}/proposals/active`)
      .then(({ result: { items } }) => {
        setPosts(
          items.filter((item) =>
            dayjs().subtract(15, "day").isBefore(item.createdAt),
          ),
        );
      });
  }, [host]);

  if (!space) {
    throw new Error("NEXT_PUBLIC_OFF_CHAIN_SPACE is not set");
  }

  if (!posts) {
    return null;
  }
  if (posts.length <= 0) {
    return <NoProposals host={host} />;
  }

  return (
    <List
      title="Active off-chain voting"
      items={(posts || []).map((item) => ({
        title: item.title,
        href: `${host}/space/${space}/proposal/${item.cid}`,
      }))}
    />
  );
}

export default function OffChainVoting() {
  if (!hasDefinedOffChainVoting()) {
    return null;
  }

  const votingHost = `${
    process.env.NEXT_PUBLIC_OFF_CHAIN_VOTING_SITE_URL ||
    "https://voting.opensquare.io"
  }`;

  return <VotingProposals host={votingHost} />;
}
