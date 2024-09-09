import React from "react";
import { useOnchainData } from "next-common/context/post";
import { isNil } from "lodash-es";
import Link from "next/link";
import { NavigationWrapper } from "next-common/components/detail/navigation/navigators";
import TriangleRight from "next-common/assets/imgs/icons/arrow-triangle-right.svg";

export function FellowshipTreasurySpendLink({ index }) {
  return (
    <Link href={`/fellowship/treasury/spends/${index}`} legacyBehavior>
      {`Treasury Spend #${index}`}
    </Link>
  );
}

export default function FellowshipReferendumTreasurySpendNavigation() {
  const onchainData = useOnchainData();
  const { treasurySpendIndex, referendumIndex } = onchainData;
  const hasTreasurySpend = !isNil(treasurySpendIndex);

  if (!hasTreasurySpend) {
    return null;
  }

  return (
    <NavigationWrapper>
      <div>Fellowship #{referendumIndex}</div>
      <div>
        <TriangleRight />
        <FellowshipTreasurySpendLink index={treasurySpendIndex} />
      </div>
    </NavigationWrapper>
  );
}
