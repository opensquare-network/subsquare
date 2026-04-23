import { useOnchainData } from "next-common/context/post";
import { isNil } from "lodash-es";
import React from "react";
import Link from "next-common/components/link";
import { NavigationWrapper } from "next-common/components/detail/navigation/navigators";
import TriangleRight from "next-common/assets/imgs/icons/arrow-triangle-right.svg";

export function MultiAssetBountyLink({ index }) {
  return (
    <Link href={`/treasury/multi-asset-bounties/${index}`}>
      {`Multi-Asset Bounty #${index}`}
    </Link>
  );
}

export default function ReferendaReferendumMultiAssetBountyNavigation() {
  const onchainData = useOnchainData();
  const { multiAssetBountyIndex, referendumIndex } = onchainData;
  const hasMultiAssetBounty = !isNil(multiAssetBountyIndex);

  if (!hasMultiAssetBounty) {
    return null;
  }

  return (
    <NavigationWrapper>
      <div>Referendum #{referendumIndex}</div>
      <div>
        <TriangleRight />
        <MultiAssetBountyLink index={multiAssetBountyIndex} />
      </div>
    </NavigationWrapper>
  );
}
