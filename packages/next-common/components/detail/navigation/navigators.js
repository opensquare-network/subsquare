import React from "react";
import Link from "next/link";
import isNil from "lodash.isnil";
import TriangleRight from "@subsquare/next/public/imgs/icons/arrow-triangle-right.svg";
import { useSelector } from "react-redux";
import { chainSelector } from "../../../store/reducers/chainSlice";
import { getMotionId, shortMotionId } from "../../../utils/motion";

export function ReferendumLink({referendumIndex}) {
  return (
    <Link href={`/democracy/referendum/${referendumIndex}`}>
      {`Referendum #${referendumIndex}`}
    </Link>
  )
}

export function ReferendumNavigationItem({referendumIndex, isLink = true}) {
  if (isNil(referendumIndex)) {
    return null
  }

  let item = <ReferendumLink referendumIndex={ referendumIndex } />;
  if (!isLink) {
    item = <div>{`Referendum #${referendumIndex}`}</div>;
  }

  return <div>
    <TriangleRight />
    { item }
  </div>
}

export function DemocracyProposalNavigator({proposalIndex, isLink = true}) {
  if (!isLink) {
    return <div>{`Proposal #${proposalIndex}`}</div>
  }

  return <Link href={`/democracy/proposal/${proposalIndex}`}>
    {`Proposal #${proposalIndex}`}
  </Link>
}

export function DemocracyExternalNavigator({blockHeight, hash = "", isLink = true}) {
  let link = <Link
    passHref={ true }
    href={ `/democracy/external/${ blockHeight }_${ hash }` }
  >
    <a>
      { `External #${ hash.slice(0, 6) }` }
    </a>
  </Link>

  if (!isLink) {
    link = `External #${hash?.slice(0, 6)}`
  }

  return <div>
    <TriangleRight />
    {link}
  </div>
}

export function CouncilMotionNavigator({ motion, hasTriangle = true }) {
  let triangle = hasTriangle ? <TriangleRight /> : null;
  const chain = useSelector(chainSelector);

  return <div>
    {triangle}
    <Link href={ `/council/motion/${ getMotionId(motion, chain) }` }>
      { `Motion #${ shortMotionId(motion) }` }
    </Link>
  </div>
}

export function TechCommMotionNavigator({motion}) {
  const chain = useSelector(chainSelector);

  return <div>
    <TriangleRight />
    <Link
      href={ `/techcomm/proposal/${ getMotionId(motion, chain) }` }
    >
      { `Tech. Comm. #${ shortMotionId(motion) }` }
    </Link>
  </div>
}
