import { useOnchainData } from "../../../context/post";
import { isNil } from "lodash-es";
import { NavigationWrapper } from "./navigators";
import TriangleRight from "../../../assets/imgs/icons/arrow-triangle-right.svg";
import React from "react";
import Link from "next/link";

export function TreasuryProposalLink({ proposalIndex }) {
  return (
    <Link href={`/treasury/proposals/${proposalIndex}`}>
      {`Treasury #${proposalIndex}`}
    </Link>
  );
}

export default function ReferendaReferendumNavigation() {
  const onchainData = useOnchainData();
  const { treasuryProposalIndex, referendumIndex } = onchainData;
  const hasTreasuryProposal = !isNil(treasuryProposalIndex);

  if (!hasTreasuryProposal) {
    return null;
  }

  return (
    <NavigationWrapper>
      <div>Referendum #{referendumIndex}</div>
      <div>
        <TriangleRight />
        <TreasuryProposalLink proposalIndex={treasuryProposalIndex} />
      </div>
    </NavigationWrapper>
  );
}
