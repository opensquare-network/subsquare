import { useOnchainData } from "next-common/context/post";
import React from "react";
import Link from "next-common/components/link";
import { NavigationWrapper } from "next-common/components/detail/navigation/navigators";
import TriangleRight from "next-common/assets/imgs/icons/arrow-triangle-right.svg";

export function TreasurySpendLink({ index }) {
  return (
    <Link href={`/treasury/spends/${index}`}>{`Treasury Spend #${index}`}</Link>
  );
}

export default function ReferendaReferendumTreasurySpendNavigation() {
  const onchainData = useOnchainData();
  const { treasurySpendIndexes, referendumIndex } = onchainData;
  const hasTreasurySpends =
    Array.isArray(treasurySpendIndexes) && treasurySpendIndexes.length > 0;

  if (!hasTreasurySpends) {
    return null;
  }

  return (
    <NavigationWrapper className="text-center">
      <span>
        Referendum #{referendumIndex}
        &nbsp;&nbsp;
        <TriangleRight className="inline align-middle" />
        Treasury Spend{" "}
        {treasurySpendIndexes.map((index, i) => (
          <span key={index}>
            <Link href={`/treasury/spends/${index}`}>{`#${index}`}</Link>
            {i < treasurySpendIndexes.length - 1 && <span>, </span>}
          </span>
        ))}
      </span>
    </NavigationWrapper>
  );
}
