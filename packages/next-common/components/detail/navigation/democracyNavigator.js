import React from "react";
import TriangleRight from "next-common/assets/imgs/icons/arrow-triangle-right.svg";
import Link from "next/link";
import {
  getMotionId,
  getUniqueMotionId,
  shortMotionId,
} from "next-common/utils/motion";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useChain } from "next-common/context/chain";
import { DemocracyReferendaTreasurySpendNavigator } from "next-common/components/detail/navigation/ReferendumNavigation";

export function MotionNavigationItem({ motion, pageMotionId, type }) {
  const chain = useChain();
  const itemId = getUniqueMotionId(motion, chain);
  const isPageMotion = itemId === pageMotionId;

  const isTechComm = type === detailPageCategory.TECH_COMM_MOTION;
  const isCouncilMotion = type === detailPageCategory.COUNCIL_MOTION;
  if (!isTechComm && !isCouncilMotion) {
    throw new Error(`Invalid motion type: ${type}`);
  }
  const prefix = isTechComm ? "Tech. Comm." : isCouncilMotion ? "Motion" : "";
  const text = `${prefix} #${shortMotionId(motion)}`;

  if (isPageMotion) {
    return text;
  }

  const linkId = getMotionId(motion);
  const link = isTechComm
    ? `/techcomm/proposals/${linkId}`
    : `/council/motions/${linkId}`;
  return (
    <Link href={link} legacyBehavior>
      {text}
    </Link>
  );
}

export function MultiMotionNavigator({ motions = [], type, pageMotionId }) {
  const chain = useChain();

  return motions.map((item, index) => (
    <div key={getUniqueMotionId(item, chain)}>
      {index <= 0 ? null : <TriangleRight />}
      <MotionNavigationItem
        motion={item}
        type={type}
        pageMotionId={pageMotionId}
      />
    </div>
  ));
}

export function ExternalProposalNavigator({ external }) {
  return (
    <div>
      <TriangleRight />
      <Link
        passHref={true}
        href={`/democracy/externals/${external.indexer.blockHeight}_${external.proposalHash}`}
      >
        {`External #${external.proposalHash?.slice(0, 6)}`}
      </Link>
    </div>
  );
}

export function ExternalTechCommMotionNavigator({ external, pageMotionId }) {
  if (external.techCommMotions?.length > 0) {
    return (
      <>
        <TriangleRight />
        <MultiMotionNavigator
          motions={external.techCommMotions}
          type={detailPageCategory.TECH_COMM_MOTION}
          pageMotionId={pageMotionId}
        />
      </>
    );
  }
}

export function ExternalCouncilMotionNavigator({ external, pageMotionId }) {
  if (external.councilMotions?.length > 0) {
    return (
      <>
        <TriangleRight />
        <MultiMotionNavigator
          motions={external.councilMotions}
          type={detailPageCategory.COUNCIL_MOTION}
          pageMotionId={pageMotionId}
        />
      </>
    );
  }
}

export function DemocracyReferendumNavigator({ external }) {
  const referendumIndex = external.referendumIndex;
  if (referendumIndex === undefined) {
    return null;
  }
  return (
    <div>
      <TriangleRight />
      <Link href={`/democracy/referenda/${referendumIndex}`} legacyBehavior>
        {`Referendum #${referendumIndex}`}
      </Link>
    </div>
  );
}

export function ExternalTreasurySpendNavigator({ external }) {
  if (!external.referendum) {
    return null;
  }
  return (
    <DemocracyReferendaTreasurySpendNavigator
      treasurySpendIndexes={external.referendum.treasurySpendIndexes}
    />
  );
}
