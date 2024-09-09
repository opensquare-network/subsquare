import React from "react";
import { useOnchainData } from "next-common/context/post";
import { isNil } from "lodash-es";
import { NavigationWrapper } from "next-common/components/detail/navigation/navigators";
import TriangleRight from "next-common/assets/imgs/icons/arrow-triangle-right.svg";
import { FellowshipReferendumLink } from "next-common/components/detail/referenda/whitelistNavigation";

export default function FellowshipTreasurySpendNavigation() {
  const onchainData = useOnchainData();
  const { gov2Referendum, index } = onchainData;
  const hasReferendum = !isNil(gov2Referendum);

  if (!hasReferendum) {
    return null;
  }

  return (
    <NavigationWrapper>
      <FellowshipReferendumLink referendumIndex={gov2Referendum} />
      <div>
        <TriangleRight />
      </div>
      Treasury Spend #{index}
    </NavigationWrapper>
  );
}
