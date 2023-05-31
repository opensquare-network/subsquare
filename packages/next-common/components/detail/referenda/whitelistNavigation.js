import React from "react";
import { useOnchainData } from "../../../context/post";
import Link from "next/link";
import { NavigationWrapper } from "../navigation/navigators";
import TriangleRight from "../../../assets/imgs/icons/arrow-triangle-right.svg";

export function FellowshipReferendumLink({ referendumIndex }) {
  return (
    <Link href={ `/fellowship/referendum/${ referendumIndex }` } legacyBehavior>
      { `Fellowship #${ referendumIndex }` }
    </Link>
  );
}

export default function ReferendaWhiteListNavigation() {
  const onchainData = useOnchainData();
  const { referendumIndex, fellowshipReferenda = [] } = onchainData;

  if (fellowshipReferenda.length <= 0) {
    return null;
  }

  const fellowshipReferendumIndex = fellowshipReferenda[0];

  return <NavigationWrapper>
    <FellowshipReferendumLink referendumIndex={ fellowshipReferendumIndex } />
    <div>
      <TriangleRight />
    </div>
    Referenda #{ referendumIndex }
  </NavigationWrapper>;
}
