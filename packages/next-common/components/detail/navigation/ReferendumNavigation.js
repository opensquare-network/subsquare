import React from "react";
import { isNil } from "lodash-es";
import {
  CouncilMotionNavigator,
  DemocracyExternalNavigator,
  DemocracyProposalNavigator,
  NavigationWrapper,
  DemocracyReferendumNavigator,
  TechCommMotionNavigator,
} from "./navigators";
import { usePost } from "next-common/context/post";
import { DemocracyReferendaTreasurySpendNavigator } from "./democracyNavigator";

export default function ReferendumNavigation() {
  const post = usePost();

  if (!isNil(post.proposalIndex)) {
    return (
      <NavigationWrapper>
        <DemocracyProposalNavigator proposalIndex={post.proposalIndex} />
        <DemocracyReferendumNavigator
          referendumIndex={post?.referendumIndex}
          isLink={false}
        />
      </NavigationWrapper>
    );
  }

  if (isNil(post.externalProposalHash)) {
    return null;
  }

  const referendum = post.onchainData;

  return (
    <NavigationWrapper>
      {referendum?.motions?.map((motion, key) => (
        <CouncilMotionNavigator key={key} motion={motion} hasTriangle={false} />
      ))}
      <DemocracyExternalNavigator
        blockHeight={post.externalProposalIndexer?.blockHeight}
        hash={post.externalProposalHash}
      />
      {referendum?.techCommMotions?.map((techCommMotion, key) => (
        <TechCommMotionNavigator motion={techCommMotion} key={key} />
      ))}
      {/* used for centrifuge/altair, they use council to fast_track external proposal */}
      {referendum?.councilMotions?.map((motion, key) => (
        <CouncilMotionNavigator key={key} motion={motion} hasTriangle={false} />
      ))}
      <DemocracyReferendumNavigator
        referendumIndex={post?.referendumIndex}
        isLink={false}
      />
      <DemocracyReferendaTreasurySpendNavigator
        treasurySpendIndexes={referendum?.treasurySpendIndexes}
      />
    </NavigationWrapper>
  );
}

export function KintsugiReferendumNavigation() {
  const post = usePost();
  const onchainData = post?.onchainData;

  if (isNil(onchainData?.publicProposalIndex)) {
    return null;
  }

  return (
    <NavigationWrapper>
      <DemocracyProposalNavigator
        proposalIndex={onchainData?.publicProposalIndex}
      />
      {onchainData?.techCommMotions?.map((techCommMotion, key) => (
        <TechCommMotionNavigator motion={techCommMotion} key={key} />
      ))}
      <DemocracyReferendumNavigator
        referendumIndex={onchainData?.referendumIndex}
        isLink={false}
      />
    </NavigationWrapper>
  );
}
