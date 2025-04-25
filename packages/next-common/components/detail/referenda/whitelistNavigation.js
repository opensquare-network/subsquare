import React from "react";
import { useOnchainData } from "../../../context/post";
import Link from "next/link";
import { NavigationWrapper } from "../navigation/navigators";

export function FellowshipReferendumLink({ referendumIndex }) {
  return (
    <Link href={`/fellowship/referenda/${referendumIndex}`}>
      {`Fellowship #${referendumIndex}`}
    </Link>
  );
}

export default function ReferendaWhiteListNavigation() {
  const onchainData = useOnchainData();
  const { fellowshipReferenda = [] } = onchainData;

  if (fellowshipReferenda.length <= 0) {
    return null;
  }

  const fellowshipReferendumIndex = fellowshipReferenda[0];

  return (
    <NavigationWrapper>
      Whitelisted by &nbsp;
      <FellowshipReferendumLink referendumIndex={fellowshipReferendumIndex} />
    </NavigationWrapper>
  );
}
