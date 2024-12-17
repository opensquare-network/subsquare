import React from "react";
import { isNil } from "lodash-es";
import {
  CouncilMotionNavigator,
  DemocracyExternalNavigator,
  DemocracyProposalNavigator,
  NavigationWrapper,
  ReferendumNavigationItem,
  TechCommMotionNavigator,
  TreasurySpendNavigator,
} from "./navigators";
import { usePost } from "next-common/context/post";

export default function ReferendumNavigation() {
  const post = usePost();

  if (!isNil(post.proposalIndex)) {
    return (
      <NavigationWrapper>
        <DemocracyProposalNavigator proposalIndex={post.proposalIndex} />
        <ReferendumNavigationItem
          referendumIndex={post?.referendumIndex}
          isLink={false}
        />
      </NavigationWrapper>
    );
  }

  if (isNil(post.externalProposalHash)) {
    return null;
  }

  return (
    <NavigationWrapper>
      {post?.onchainData?.motions?.map((motion, key) => (
        <CouncilMotionNavigator key={key} motion={motion} hasTriangle={false} />
      ))}
      <DemocracyExternalNavigator
        blockHeight={post.externalProposalIndexer?.blockHeight}
        hash={post.externalProposalHash}
      />
      {post?.onchainData?.techCommMotions?.map((techCommMotion, key) => (
        <TechCommMotionNavigator motion={techCommMotion} key={key} />
      ))}

      {/* used for centrifuge/altair, they use council to fast_track external proposal */}
      {post?.onchainData?.councilMotions?.map((motion, key) => (
        <CouncilMotionNavigator key={key} motion={motion} hasTriangle={false} />
      ))}

      <ReferendumNavigationItem
        referendumIndex={post?.referendumIndex}
        isLink={false}
      />

      {post?.onchainData?.treasuryProposals.map((item) => (
        <TreasurySpendNavigator key={item.index} index={item.index} />
      ))}
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
      <ReferendumNavigationItem
        referendumIndex={onchainData?.referendumIndex}
        isLink={false}
      />
    </NavigationWrapper>
  );
}
