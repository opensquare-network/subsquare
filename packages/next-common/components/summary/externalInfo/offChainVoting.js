import List from "./list";
import dayjs from "dayjs";
import styled from "styled-components";
import { useEffect, useState } from "react";
import Api from "next-common/services/api";
import { votingSpace, votingHost } from "next-common/utils/opensquareVoting";

const NewProposal = styled.a`
  cursor: pointer;
  background: linear-gradient(270deg, #04d2c5 0%, #6848ff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

function NoProposals() {
  return (
    <div className="flex gap-[8px] text-textTertiary text12Medium">
      <span>No active off-chain voting</span>
      <NewProposal
        className="text12Bold"
        target="_blank"
        href={`${votingHost}/space/${votingSpace}/create`}
      >
        + New Proposal
      </NewProposal>
    </div>
  );
}

function VotingProposals() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    new Api(votingHost)
      .fetch(`/api/${votingSpace}/proposals/active`)
      .then(({ result: { items } }) => {
        setPosts(
          items.filter((item) =>
            dayjs().subtract(15, "day").isBefore(item.createdAt),
          ),
        );
      });
  }, []);

  if (posts.length <= 0) {
    return <NoProposals />;
  }

  return (
    <List
      title="Active off-chain voting"
      items={(posts || []).map((item) => ({
        title: item.title,
        href: `${votingHost}/space/${votingSpace}/proposal/${item.cid}`,
      }))}
    />
  );
}

export default function OffChainVoting() {
  if (!votingSpace) {
    return null;
  }

  return <VotingProposals />;
}
