import { useOnchainData } from "next-common/context/post";
import { isNil } from "lodash-es";
import { NavigationWrapper } from "next-common/components/detail/navigation/navigators";
import ReferendaReferendumLink from "next-common/components/detail/navigation/common/referendaReferendumLink";
import TriangleRight from "next-common/assets/imgs/icons/arrow-triangle-right.svg";
import React from "react";

export default function TreasurySpendByGov2Navigation() {
  const onchainData = useOnchainData();
  const { gov2Referendum, index } = onchainData;
  const hasReferendum = !isNil(gov2Referendum);

  if (!hasReferendum) {
    return null;
  }

  return (
    <NavigationWrapper>
      <ReferendaReferendumLink referendumIndex={gov2Referendum} />
      <div>
        <TriangleRight />
      </div>
      Treasury Spend #{index}
    </NavigationWrapper>
  );
}
