import { usePageProps } from "next-common/context/page";
import List from "./list";

export default function Bounties() {
  const { activeBountyPosts } = usePageProps();
  return (
    <List
      title="Bounties calling for hunters"
      items={(activeBountyPosts || []).map((item) => ({
        title: item.title,
        href: `${process.env.NEXT_PUBLIC_BOUNTIES_SITE_URL}/#/network/${process.env.NEXT_PUBLIC_CHAIN}/bounty/${item.parentBountyIndex}/child-bounty/${item.index}`,
      }))}
    />
  );
}
