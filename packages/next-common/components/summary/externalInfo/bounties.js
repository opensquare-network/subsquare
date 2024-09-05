import List from "./list";
import { hasDefinedBounties } from "next-common/utils/summaryExternalInfo";
import { useEffect, useState } from "react";
import Api from "next-common/services/api";
import { useChain } from "next-common/context/chain";

function BountyProposals() {
  const chain = useChain();
  const [posts, setPosts] = useState();
  useEffect(() => {
    new Api(process.env.NEXT_PUBLIC_BOUNTIES_API_URL)
      .fetch("child-bounties")
      .then(({ result: { items } }) => {
        setPosts(items.filter((item) => item.network === chain));
      });
  }, [chain]);

  return (
    <List
      title="Bounties calling for hunters"
      items={(posts || []).map((item) => ({
        title: item.title,
        href: `${process.env.NEXT_PUBLIC_BOUNTIES_SITE_URL}/#/network/${process.env.NEXT_PUBLIC_CHAIN}/bounty/${item.parentBountyIndex}/child-bounty/${item.index}`,
      }))}
    />
  );
}

export default function Bounties() {
  if (!hasDefinedBounties()) {
    return null;
  }

  return <BountyProposals />;
}
