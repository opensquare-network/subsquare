import React from "react";
import {
  DemocracyProposalNavigator,
  NavigationWrapper,
  ReferendumNavigationItem,
  TechCommMotionNavigator
} from "./navigators";
import isNil from "lodash.isnil";

export default function DemocracyProposalNavigation({ proposalIndex, referendumIndex }) {
  return <NavigationWrapper>
    <DemocracyProposalNavigator proposalIndex={ proposalIndex } isLink={ false } />
    <ReferendumNavigationItem referendumIndex={ referendumIndex } />
  </NavigationWrapper>
}

export function KintsugiDemocracyProposalNavigation({ post }) {
  return <NavigationWrapper>
    <div>{ `Proposal #${ post.proposalIndex }` }</div>
    { post?.onchainData?.techCommMotions?.map(
      (techCommMotion, key) => <TechCommMotionNavigator motion={ techCommMotion } key={ key } />
    ) }
    { !isNil(post?.referendumIndex) && <ReferendumNavigationItem referendumIndex={ post.referendumIndex } /> }
  </NavigationWrapper>

}
