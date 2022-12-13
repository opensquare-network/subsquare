import React from "react";
import {
  DemocracyProposalNavigator,
  NavigationWrapper,
  ReferendumNavigationItem,
  TechCommMotionNavigator,
} from "./navigators";
import isNil from "lodash.isnil";

export default function DemocracyProposalNavigation({
  proposalIndex,
  referendumIndex,
}) {
  return (
    <NavigationWrapper>
      <DemocracyProposalNavigator
        proposalIndex={proposalIndex}
        isLink={false}
      />
      <ReferendumNavigationItem referendumIndex={referendumIndex} />
    </NavigationWrapper>
  );
}

export function KintsugiDemocracyProposalNavigation({ post }) {
  const onchainData = post?.onchainData;

  return (
    <NavigationWrapper>
      <div>{`Proposal #${onchainData?.proposalIndex}`}</div>
      {onchainData?.techCommMotions?.map((techCommMotion, key) => (
        <TechCommMotionNavigator motion={techCommMotion} key={key} />
      ))}
      {!isNil(onchainData?.referendumIndex) && (
        <ReferendumNavigationItem
          referendumIndex={onchainData.referendumIndex}
        />
      )}
    </NavigationWrapper>
  );
}
