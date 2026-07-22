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
    <NavigationWrapper>
      <div>Referendum #{referendumIndex}</div>
      <div>
        <TriangleRight />
        Treasury Spend&nbsp;
        {treasurySpendIndexes.map((index, i) => (
          <React.Fragment key={index}>
            {i > 0 && <span>,&nbsp;</span>}
            <Link href={`/treasury/spends/${index}`}>{`#${index}`}</Link>
          </React.Fragment>
        ))}
      </div>
    </NavigationWrapper>
  );
}
