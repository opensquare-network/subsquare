import React from "react";
import { NavigationWrapper } from "next-common/components/detail/navigation/navigators";
import TriangleRight from "next-common/assets/imgs/icons/arrow-triangle-right.svg";
import Link from "next/link";
import { useOnchainData } from "next-common/context/post";
import { isNil } from "lodash-es";

export function CommunityTreasuryProposalLink({ proposalIndex }) {
  return (
    <Link href={`/community-treasury/proposals/${proposalIndex}`}>
      {`Treasury Proposal #${proposalIndex}`}
    </Link>
  );
}

export default function AstarCommunityMotionNavigation() {
  const { index, relatedTreasuryProposals } = useOnchainData();
  const { proposalId } = relatedTreasuryProposals?.[0] || {};

  if (isNil(proposalId)) {
    return null;
  }

  return (
    <NavigationWrapper>
      <CommunityTreasuryProposalLink proposalIndex={proposalId} />
      <div>
        <TriangleRight />
      </div>
      Motion #{index}
    </NavigationWrapper>
  );
}
