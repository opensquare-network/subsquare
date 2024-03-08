import React from "react";
import {
  DemocracyProposalNavigator,
  NavigationWrapper,
  ReferendumNavigationItem,
  TechCommMotionNavigator,
} from "./navigators";
import { isNil } from "lodash-es";
import { usePost } from "next-common/context/post";

export default function DemocracyProposalNavigation() {
  const post = usePost();
  const proposalIndex = post?.proposalIndex;
  const referendumIndex = post?.referendumIndex;

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

export function KintsugiDemocracyProposalNavigation() {
  const post = usePost();
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
