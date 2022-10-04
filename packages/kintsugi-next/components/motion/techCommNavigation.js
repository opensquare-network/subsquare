import isNil from "lodash.isnil";
import {
  DemocracyProposalNavigator,
  NavigationWrapper, ReferendumNavigationItem,
  TechCommMotionNavigator
} from "next-common/components/detail/navigation/navigators";

export default function TechCommNavigation({ motion = {} }) {
  const hasProposal = !isNil(motion.proposalIndex);
  const hasReferendum = !isNil(motion.referendumIndex);

  if (!hasProposal) {
    return null;
  }

  let referendum = null;
  if (hasReferendum) {
    referendum = <ReferendumNavigationItem referendumIndex={motion.referendumIndex}/>
  }

  return <NavigationWrapper>
    <DemocracyProposalNavigator proposalIndex={ motion.proposalIndex } />
    <TechCommMotionNavigator motion={motion} isLink={false}/>
    { referendum }
  </NavigationWrapper>
}
