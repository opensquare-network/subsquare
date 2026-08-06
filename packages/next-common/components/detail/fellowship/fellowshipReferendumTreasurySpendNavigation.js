import React from "react";
import { useOnchainData } from "next-common/context/post";
import Link from "next-common/components/link";
import { NavigationWrapper } from "next-common/components/detail/navigation/navigators";
import TriangleRight from "next-common/assets/imgs/icons/arrow-triangle-right.svg";
import { sortBy } from "lodash-es";

export default function FellowshipReferendumTreasurySpendNavigation() {
  const onchainData = useOnchainData();
  const { treasurySpendIndexes, referendumIndex } = onchainData;
  const hasTreasurySpends =
    Array.isArray(treasurySpendIndexes) && treasurySpendIndexes.length > 0;

  if (!hasTreasurySpends) {
    return null;
  }

  const sortedTreasurySpendIndexes = sortBy(treasurySpendIndexes);

  return (
    <NavigationWrapper className="text-center">
      <span>
        Fellowship #{referendumIndex}
        &nbsp;&nbsp;
        <TriangleRight className="inline align-middle" />
        Treasury Spend{" "}
        {sortedTreasurySpendIndexes.map((index, i) => (
          <span key={index}>
            <Link
              href={`/fellowship/treasury/spends/${index}`}
            >{`#${index}`}</Link>
            {i < sortedTreasurySpendIndexes.length - 1 && <span>, </span>}
          </span>
        ))}
      </span>
    </NavigationWrapper>
  );
}
