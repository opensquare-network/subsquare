import { usePageProps } from "next-common/context/page";
import List from "./list";
import styled from "styled-components";

const NewProposal = styled.a`
  cursor: pointer;
  background: linear-gradient(270deg, #04d2c5 0%, #6848ff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export default function OffChainVoting() {
  const { activeOffChainVotingPosts } = usePageProps();
  const votingHost = `${
    process.env.NEXT_PUBLIC_OFF_CHAIN_VOTING_SITE_URL ||
    "https://voting.opensquare.io"
  }`;
  if (!activeOffChainVotingPosts || !activeOffChainVotingPosts.length) {
    return (
      <div className="flex gap-[8px] text-textTertiary leading-[16px] font-medium text-[12px]">
        <span>No active off-chain voting</span>
        <NewProposal
          target="_blank"
          href={`${votingHost}/space/${process.env.NEXT_PUBLIC_OFF_CHAIN_SPACE}/create`}
        >
          + New Proposal
        </NewProposal>
      </div>
    );
  }

  return (
    <List
      title="Active off-chain voting"
      items={(activeOffChainVotingPosts || []).map((item) => ({
        title: item.title,
        href: `${votingHost}/space/${process.env.NEXT_PUBLIC_OFF_CHAIN_SPACE}/proposal/${item.cid}`,
      }))}
    />
  );
}
