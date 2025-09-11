import React from "react";
import {
  DemocracyProposalNavigator,
  NavigationWrapper,
  DemocracyReferendumNavigator,
  TechCommMotionNavigator,
} from "./navigators";
import { isNil } from "lodash-es";
import { usePost } from "next-common/context/post";
import { PublicProposalTreasurySpendNavigator } from "./democracyNavigator";

export default function DemocracyProposalNavigation() {
  const post = usePost();
  const publicProposal = post?.onchainData;
  const proposalIndex = post?.proposalIndex;
  const referendumIndex = post?.referendumIndex;

  return (
    <NavigationWrapper>
      <DemocracyProposalNavigator
        proposalIndex={proposalIndex}
        isLink={false}
      />
      <DemocracyReferendumNavigator referendumIndex={referendumIndex} />
      <PublicProposalTreasurySpendNavigator publicProposal={publicProposal} />
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
        <DemocracyReferendumNavigator
          referendumIndex={onchainData.referendumIndex}
        />
      )}
    </NavigationWrapper>
  );
}
