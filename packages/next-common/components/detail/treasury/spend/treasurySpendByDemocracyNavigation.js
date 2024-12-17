import { useOnchainData } from "next-common/context/post";
import { NavigationWrapper } from "next-common/components/detail/navigation/navigators";
import DemocracyReferendumLink from "../../navigation/common/democracyReferendumLink";
import TriangleRight from "next-common/assets/imgs/icons/arrow-triangle-right.svg";
import React from "react";

export default function TreasurySpendByDemocracyNavigation() {
  const onchainData = useOnchainData();
  const { isByDemocracy, democracyReferendum, index } = onchainData;

  if (!isByDemocracy) {
    return null;
  }

  return (
    <NavigationWrapper>
      <DemocracyReferendumLink referendumIndex={democracyReferendum} />
      <div>
        <TriangleRight />
      </div>
      Treasury Spend #{index}
    </NavigationWrapper>
  );
}
