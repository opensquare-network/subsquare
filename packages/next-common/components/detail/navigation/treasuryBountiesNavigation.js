import { useOnchainData } from "../../../context/post";
import { isNil } from "lodash-es";
import { NavigationWrapper } from "./navigators";
import React from "react";
import TriangleRight from "../../../assets/imgs/icons/arrow-triangle-right.svg";
import ReferendaReferendumLink from "next-common/components/detail/navigation/common/referendaReferendumLink";

export default function ReferendaReferendumTreasuryBountiesNavigation() {
  const onchainData = useOnchainData();
  const { gov2Referendum, bountyIndex } = onchainData;

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
      Treasury #{bountyIndex}
    </NavigationWrapper>
  );
}
