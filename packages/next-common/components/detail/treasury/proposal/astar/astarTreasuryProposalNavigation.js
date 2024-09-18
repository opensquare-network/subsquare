import React from "react";
import { NavigationWrapper } from "next-common/components/detail/navigation/navigators";
import TriangleRight from "next-common/assets/imgs/icons/arrow-triangle-right.svg";
import Link from "next/link";
import { useOnchainData } from "next-common/context/post";
import { isNil } from "lodash-es";

export function CommunityMotionLink({ index }) {
  return (
    <Link href={`/community-council/motions/${index}`} legacyBehavior>
      {`Motion #${index}`}
    </Link>
  );
}

export default function AstarTreasuryProposalNavigation() {
  const onchainData = useOnchainData();
  const { proposalIndex, communityMotions } = onchainData || {};
  const { index } = communityMotions?.[0] || {};

  if (isNil(index)) {
    return null;
  }

  return (
    <NavigationWrapper>
      Treasury Proposal #{proposalIndex}
      <div>
        <TriangleRight />
      </div>
      <CommunityMotionLink index={index} />
    </NavigationWrapper>
  );
}
