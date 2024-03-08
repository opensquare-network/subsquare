import { useOnchainData } from "../../../context/post";
import { isNil } from "lodash-es";
import { NavigationWrapper } from "./navigators";
import React from "react";
import Link from "next/link";
import TriangleRight from "../../../assets/imgs/icons/arrow-triangle-right.svg";

export function Gov2ReferendumLink({ referendumIndex }) {
  return (
    <Link href={`/referenda/${referendumIndex}`} legacyBehavior>
      {`Referendum #${referendumIndex}`}
    </Link>
  );
}

export default function TreasuryProposalNavigation() {
  const onchainData = useOnchainData();
  const { gov2Referendum, proposalIndex } = onchainData;
  const hasReferendum = !isNil(gov2Referendum);

  if (!hasReferendum) {
    return null;
  }

  return (
    <NavigationWrapper>
      <Gov2ReferendumLink referendumIndex={gov2Referendum} />
      <div>
        <TriangleRight />
      </div>
      Treasury #{proposalIndex}
    </NavigationWrapper>
  );
}
