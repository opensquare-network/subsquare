import React from "react";
import { useOnchainData } from "../../../context/post";
import { NavigationWrapper } from "../navigation/navigators";
import Link from "next/link";
import TriangleRight from "../../../assets/imgs/icons/arrow-triangle-right.svg";

export function ReferendumLink({ referendumIndex }) {
  return (
    <Link href={ `/referenda/referendum/${ referendumIndex }` } legacyBehavior>
      { `Referenda #${ referendumIndex }` }
    </Link>
  );
}

function OpenGovReferendum({ referendumIndex }) {
  return (
    <div>
      <TriangleRight />
      <ReferendumLink referendumIndex={ referendumIndex } />
    </div>
  );
}

export default function FellowshipWhitelistNavigation() {
  const onchainData = useOnchainData();
  const { referendumIndex, openGovReferenda = [] } = onchainData;

  if (openGovReferenda.length <= 0) {
    return null;
  }

  return <NavigationWrapper>
    <div>{ `Fellowship #${ referendumIndex }` }</div>
    {
      openGovReferenda.map(openGovIndex => <OpenGovReferendum key={openGovIndex} referendumIndex={openGovIndex}/>)
    }
  </NavigationWrapper>;
}
