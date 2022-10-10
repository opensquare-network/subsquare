import {
  CouncilMotionNavigator,
  DemocracyExternalNavigator,
  NavigationWrapper, ReferendumNavigationItem,
  TechCommMotionNavigator
} from "./navigators";

export default function ExternalNavigation({ post = {} }) {
  return <NavigationWrapper>
    { post?.onchainData?.motions?.map((motion, key) => (
      <CouncilMotionNavigator key={ key } motion={ motion } hasTriangle={ false } />
    )) }
    <DemocracyExternalNavigator hash={ post?.externalProposalHash } isLink={ false } />
    { post?.onchainData?.techCommMotions?.map(
      (techCommMotion, key) => <TechCommMotionNavigator motion={ techCommMotion } key={ key } />
    ) }

    {/* centrifuge/altair use council to `fast_track` external proposal, so here we have councilMotions*/}
    { post?.onchainData?.councilMotions?.map((motion, key) => (
      <CouncilMotionNavigator key={ key } motion={ motion } />
    )) }

    <ReferendumNavigationItem referendumIndex={ post?.referendumIndex } />
  </NavigationWrapper>
}
