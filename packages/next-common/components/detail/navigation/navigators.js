import React from "react";
import Link from "next/link";
import { isNil } from "lodash-es";
import TriangleRight from "../../../assets/imgs/icons/arrow-triangle-right.svg";
import { getMotionId, shortMotionId } from "../../../utils/motion";
import styled from "styled-components";
import { NoticeWrapper } from "../../styled/containers/titleContainer";
import { useChain } from "../../../context/chain";

export function ReferendumLink({ referendumIndex }) {
  return (
    <Link href={`/democracy/referenda/${referendumIndex}`} legacyBehavior>
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
    <Link href={`/democracy/proposals/${proposalIndex}`} legacyBehavior>
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
    <Link passHref={true} href={`/democracy/externals/${blockHeight}_${hash}`}>
      {`External #${hash.slice(0, 6)}`}
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
      <Link
        href={`/council/motions/${getMotionId(motion, chain)}`}
        legacyBehavior
      >
        {`Motion #${shortMotionId(motion)}`}
      </Link>
    </div>
  );
}

export function TechCommMotionNavigator({ motion = {}, isLink = true }) {
  const chain = useChain();

  let link = (
    <Link
      href={`/techcomm/proposals/${getMotionId(motion, chain)}`}
      legacyBehavior
    >
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

export function TreasurySpendNavigator({ index, isLink = true }) {
  let link = <div>{`Treasury Spend #${index}`}</div>;

  if (isLink) {
    link = (
      <Link href={`/treasury/spends/${index}`} legacyBehavior>
        {`Treasury Spend #${index}`}
      </Link>
    );
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
    fill: var(--textTertiary);
  }

  a {
    color: var(--sapphire500);
  }

  > :not(:first-child) {
    margin-left: 8px;
  }
`;
