import { usePageProps } from "next-common/context/page";
import List from "./list";

export default function OffChainVoting() {
  const { activeOffChainVotingPosts } = usePageProps();
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
