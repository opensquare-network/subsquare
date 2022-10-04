import isNil from "lodash.isnil";
import {
  CouncilMotionNavigator, DemocracyExternalNavigator,
  DemocracyProposalNavigator,
  NavigationWrapper,
  ReferendumNavigationItem, TechCommMotionNavigator
} from "./navigators";

export default function ReferendumNavigation({ post = {} }) {
  if (!isNil(post.proposalIndex)) {
    return <NavigationWrapper>
      <DemocracyProposalNavigator proposalIndex={ post.proposalIndex } />
      <ReferendumNavigationItem referendumIndex={ post?.referendumIndex } isLink={ false } />
    </NavigationWrapper>
  }

  if (isNil(post.externalProposalHash)) {
    return null
  }

  return <NavigationWrapper>
    {post?.onchainData?.motions?.map((motion, key) =>
      <CouncilMotionNavigator key={key} motion={motion} hasTriangle={false}/>)}
    <DemocracyExternalNavigator
      blockHeight={post.externalProposalIndexer?.blockHeight}
      hash={post.externalProposalHash}
    />
    {post?.onchainData?.techCommMotions?.map(
      (techCommMotion, key) => <TechCommMotionNavigator motion={ techCommMotion } key={ key } />
    )}

    {/* used for centrifuge/altair, they use council to fast_track external proposal */}
    {post?.onchainData?.councilMotions?.map((motion, key) => (
      <CouncilMotionNavigator key={key} motion={motion} hasTriangle={false}/>
    ))}

    <ReferendumNavigationItem referendumIndex={ post?.referendumIndex } isLink={ false } />
  </NavigationWrapper>
}
