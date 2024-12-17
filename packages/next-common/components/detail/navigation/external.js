import React from "react";
import {
  CouncilMotionNavigator,
  DemocracyExternalNavigator,
  NavigationWrapper,
  ReferendumNavigationItem,
  TechCommMotionNavigator,
} from "./navigators";
import { usePost } from "next-common/context/post";
import { DemocracyReferendaTreasurySpendNavigator } from "./ReferendumNavigation";

export function ExternalTreasurySpendNavigator({ external }) {
  if (!external.referendum) {
    return null;
  }
  return (
    <DemocracyReferendaTreasurySpendNavigator
      treasuryProposals={external.referendum.treasuryProposals}
    />
  );
}

export default function ExternalNavigation() {
  const post = usePost();

  const external = post?.onchainData;

  return (
    <NavigationWrapper>
      {external?.motions?.map((motion, key) => (
        <CouncilMotionNavigator key={key} motion={motion} hasTriangle={false} />
      ))}
      <DemocracyExternalNavigator
        hash={post?.externalProposalHash}
        isLink={false}
      />
      {external?.techCommMotions?.map((techCommMotion, key) => (
        <TechCommMotionNavigator motion={techCommMotion} key={key} />
      ))}

      {/* centrifuge/altair use council to `fast_track` external proposal, so here we have councilMotions*/}
      {external?.councilMotions?.map((motion, key) => (
        <CouncilMotionNavigator key={key} motion={motion} />
      ))}

      <ReferendumNavigationItem referendumIndex={post?.referendumIndex} />
      <ExternalTreasurySpendNavigator external={external} />
    </NavigationWrapper>
  );
}
