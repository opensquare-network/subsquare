import React from "react";
import Link from "next/link";
import isNil from "lodash.isnil";
import TriangleRight from "../../../assets/imgs/icons/arrow-triangle-right.svg";
import { getMotionId, shortMotionId } from "../../../utils/motion";
import styled from "styled-components";
import { NoticeWrapper } from "../../styled/containers/titleContainer";
import { useChain } from "../../../context/chain";

export function ReferendumLink({ referendumIndex }) {
  return (
    <Link href={`/democracy/referendum/${referendumIndex}`}>
      {`Referendum #${referendumIndex}`}
    </Link>
  );
}

export function ReferendumNavigationItem({ referendumIndex, isLink = true }) {
  if (isNil(referendumIndex)) {
    return null;
  }

  let item = <ReferendumLink referendumIndex={referendumIndex} />;
  if (!isLink) {
    item = <div>{`Referendum #${referendumIndex}`}</div>;
  }

  return (
    <div>
      <TriangleRight />
      {item}
    </div>
  );
}

export function DemocracyProposalNavigator({ proposalIndex, isLink = true }) {
  if (!isLink) {
    return <div>{`Proposal #${proposalIndex}`}</div>;
  }

  return (
    <Link href={`/democracy/proposal/${proposalIndex}`}>
      {`Proposal #${proposalIndex}`}
    </Link>
  );
}

export function DemocracyExternalNavigator({
  blockHeight,
  hash = "",
  isLink = true,
}) {
  let link = (
    <Link passHref={true} href={`/democracy/external/${blockHeight}_${hash}`}>
      <a>{`External #${hash.slice(0, 6)}`}</a>
    </Link>
  );

  if (!isLink) {
    link = `External #${hash?.slice(0, 6)}`;
  }

  return (
    <div>
      <TriangleRight />
      {link}
    </div>
  );
}

export function CouncilMotionNavigator({ motion, hasTriangle = true }) {
  let triangle = hasTriangle ? <TriangleRight /> : null;
  const chain = useChain();

  return (
    <div>
      {triangle}
      <Link href={`/council/motion/${getMotionId(motion, chain)}`}>
        {`Motion #${shortMotionId(motion)}`}
      </Link>
    </div>
  );
}

export function TechCommMotionNavigator({ motion = {}, isLink = true }) {
  const chain = useChain();

  let link = (
    <Link href={`/techcomm/proposal/${getMotionId(motion, chain)}`}>
      {`Tech. Comm. #${shortMotionId(motion)}`}
    </Link>
  );

  if (!isLink) {
    link = `Tech. Comm. #${shortMotionId(motion)}`;
  }

  return (
    <div>
      <TriangleRight />
      {link}
    </div>
  );
}

export const NavigationWrapper = styled(NoticeWrapper)`
  > div {
    display: flex;
    align-items: center;
  }

  > div > svg {
    margin-right: 8px;
    fill: ${(props) => props.theme.textTertiary};
  }

  a {
    color: ${(props) => props.theme.secondarySapphire500};
  }

  > :not(:first-child) {
    margin-left: 8px;
  }
`;
