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
  if (!activeOffChainVotingPosts || !activeOffChainVotingPosts.length) {
    return (
      <div className="flex gap-[8px] text-textTertiary leading-[16px] font-medium text-[12px]">
        <span>No active off-chain voting</span>
        <NewProposal
          target="_blank"
          href={`https://voting.opensquare.io/space/${process.env.NEXT_PUBLIC_VOTING_SPACE_NAME}/create`}
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
        href: `${process.env.NEXT_PUBLIC_VOTING_SITE_URL}/space/${process.env.NEXT_PUBLIC_VOTING_SPACE_NAME}/proposal/${item.cid}`,
      }))}
    />
  );
}
