import { isNil } from "lodash-es";
import {
  DemocracyProposalNavigator,
  NavigationWrapper,
  ReferendumNavigationItem,
  TechCommMotionNavigator,
} from "next-common/components/detail/navigation/navigators";

export default function TechCommNavigation({ motion = {} }) {
  const publicProposal = motion.onchainData?.publicProposals?.[0];
  const hasProposal = !isNil(publicProposal?.proposalIndex);
  const hasReferendum = !isNil(publicProposal?.referendumIndex);

  if (!hasProposal) {
    return null;
  }

  let referendum = null;
  if (hasReferendum) {
    referendum = (
      <ReferendumNavigationItem
        referendumIndex={publicProposal.referendumIndex}
      />
    );
  }

  return (
    <NavigationWrapper>
      <DemocracyProposalNavigator
        proposalIndex={publicProposal.proposalIndex}
      />
      <TechCommMotionNavigator motion={motion} isLink={false} />
      {referendum}
    </NavigationWrapper>
  );
}
