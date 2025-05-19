import { useOnchainData } from "next-common/context/post";
import { isNil } from "lodash-es";
import React from "react";
import Link from "next/link";
import { NavigationWrapper } from "next-common/components/detail/navigation/navigators";
import TriangleRight from "next-common/assets/imgs/icons/arrow-triangle-right.svg";

export function TreasurySpendLink({ index }) {
  return (
    <Link href={`/treasury/spends/${index}`}>{`Treasury Spend #${index}`}</Link>
  );
}

export default function ReferendaReferendumTreasurySpendNavigation() {
  const onchainData = useOnchainData();
  const { treasurySpendIndex, referendumIndex } = onchainData;
  const hasTreasurySpend = !isNil(treasurySpendIndex);

  if (!hasTreasurySpend) {
    return null;
  }

  return (
    <NavigationWrapper>
      <div>Referendum #{referendumIndex}</div>
      <div>
        <TriangleRight />
        <TreasurySpendLink index={treasurySpendIndex} />
      </div>
    </NavigationWrapper>
  );
}
