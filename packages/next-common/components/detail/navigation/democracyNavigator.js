import React from "react";
import TriangleRight from "next-common/assets/imgs/icons/arrow-triangle-right.svg";
import { getUniqueMotionId } from "next-common/utils/motion";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import {
  CouncilMotionNavigator,
  DemocracyExternalNavigator,
  DemocracyReferendumNavigator,
  TechCommMotionNavigator,
  TreasurySpendNavigator,
} from "./navigators";

export function MotionNavigator({
  motion,
  pageMotionId,
  type,
  hasTriangle = true,
}) {
  const isPageMotion = getUniqueMotionId(motion) === pageMotionId;
  if (type === detailPageCategory.TECH_COMM_MOTION) {
    return (
      <TechCommMotionNavigator
        motion={motion}
        isLink={!isPageMotion}
        hasTriangle={hasTriangle}
      />
    );
  }
  if (type === detailPageCategory.COUNCIL_MOTION) {
    return (
      <CouncilMotionNavigator
        motion={motion}
        isLink={!isPageMotion}
        hasTriangle={hasTriangle}
      />
    );
  }
  throw new Error(`Invalid motion type: ${type}`);
}

export function MultiMotionNavigator({ motions = [], type, pageMotionId }) {
  return motions.map((item, index) => (
    <div key={getUniqueMotionId(item)}>
      <MotionNavigator
        motion={item}
        type={type}
        pageMotionId={pageMotionId}
        hasTriangle={index > 0}
      />
    </div>
  ));
}

export function ExternalProposalNavigator({ external }) {
  return (
    <DemocracyExternalNavigator
      blockHeight={external.indexer.blockHeight}
      hash={external.proposalHash}
    />
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

export function ExternalReferendumNavigator({ external }) {
  const referendumIndex = external.referendumIndex;
  if (referendumIndex === undefined) {
    return null;
  }
  return <DemocracyReferendumNavigator referendumIndex={referendumIndex} />;
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

export function DemocracyReferendaTreasurySpendNavigator({
  treasurySpendIndexes = [],
}) {
  return treasurySpendIndexes.map((proposalIndex, i) => (
    <div key={proposalIndex}>
      <TreasurySpendNavigator
        key={proposalIndex}
        index={proposalIndex}
        hasTriangle={i > 0}
      />
    </div>
  ));
}
