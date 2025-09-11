import React from "react";
import Link from "next/link";
import { isNil } from "lodash-es";
import TriangleRight from "../../../assets/imgs/icons/arrow-triangle-right.svg";
import { getMotionId, shortMotionId } from "../../../utils/motion";
import styled from "styled-components";
import { NoticeWrapper } from "../../styled/containers/titleContainer";

export function ReferendumLink({ referendumIndex }) {
  return (
    <Link href={`/democracy/referenda/${referendumIndex}`}>
      {`Referendum #${referendumIndex}`}
    </Link>
  );
}

export function DemocracyReferendumNavigator({
  referendumIndex,
  isLink = true,
  hasTriangle = true,
}) {
  if (isNil(referendumIndex)) {
    return null;
  }

  let item = <ReferendumLink referendumIndex={referendumIndex} />;
  if (!isLink) {
    item = <div>{`Referendum #${referendumIndex}`}</div>;
  }

  return (
    <div>
      {hasTriangle && <TriangleRight />}
      {item}
    </div>
  );
}

export function DemocracyProposalNavigator({ proposalIndex, isLink = true }) {
  if (!isLink) {
    return <div>{`Proposal #${proposalIndex}`}</div>;
  }

  return (
    <Link href={`/democracy/proposals/${proposalIndex}`}>
      {`Proposal #${proposalIndex}`}
    </Link>
  );
}

export function DemocracyExternalNavigator({
  blockHeight,
  hash = "",
  isLink = true,
  hasTriangle = true,
}) {
  let link = (
    <Link passHref={true} href={`/democracy/externals/${blockHeight}_${hash}`}>
      {`External #${hash.slice(0, 6)}`}
    </Link>
  );

  if (!isLink) {
    link = `External #${hash?.slice(0, 6)}`;
  }

  return (
    <div>
      {hasTriangle && <TriangleRight />}
      {link}
    </div>
  );
}

export function CouncilMotionNavigator({
  motion,
  isLink = true,
  hasTriangle = true,
}) {
  let link = (
    <Link href={`/council/motions/${getMotionId(motion)}`}>
      {`Council #${shortMotionId(motion)}`}
    </Link>
  );

  if (!isLink) {
    link = `Council #${shortMotionId(motion)}`;
  }

  return (
    <div>
      {hasTriangle && <TriangleRight />}
      {link}
    </div>
  );
}

export function TechCommMotionNavigator({
  motion = {},
  isLink = true,
  hasTriangle = true,
}) {
  let link = (
    <Link href={`/techcomm/proposals/${getMotionId(motion)}`}>
      {`Tech. Comm. #${shortMotionId(motion)}`}
    </Link>
  );

  if (!isLink) {
    link = `Tech. Comm. #${shortMotionId(motion)}`;
  }

  return (
    <div>
      {hasTriangle && <TriangleRight />}
      {link}
    </div>
  );
}

export function TreasurySpendNavigator({
  index,
  isLink = true,
  hasTriangle = true,
}) {
  let link = <div>{`Treasury Spend #${index}`}</div>;

  if (isLink) {
    link = (
      <Link href={`/treasury/spends/${index}`}>
        {`Treasury Spend #${index}`}
      </Link>
    );
  }

  return (
    <div>
      {hasTriangle && <TriangleRight />}
      {link}
    </div>
  );
}

export const NavigationWrapper = styled(NoticeWrapper)`
  > div {
    display: flex;
    align-items: center;
  }

  svg {
    margin-right: 8px;
    path {
      fill: var(--textTertiary);
    }
  }

  a {
    color: var(--sapphire500);
  }

  > :not(:first-child) {
    margin-left: 8px;
  }
`;
