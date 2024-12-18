import { getUniqueMotionId } from "next-common/utils/motion";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { NavigationWrapper } from "next-common/components/detail/navigation/navigators";
import { useChain } from "next-common/context/chain";
import { DemocracyReferendaTreasurySpendNavigator } from "next-common/components/detail/navigation/ReferendumNavigation";
import {
  ExternalCouncilMotionNavigator,
  ExternalProposalNavigator,
  ExternalReferendumNavigator,
  ExternalTechCommMotionNavigator,
  MultiMotionNavigator,
} from "next-common/components/detail/navigation/democracyNavigator";

export function ExternalTreasurySpendNavigator({ external }) {
  if (!external.referendum) {
    return null;
  }
  return (
    <DemocracyReferendaTreasurySpendNavigator
      treasurySpendIndexes={external.referendum.treasurySpendIndexes}
    />
  );
}

export default function DemocracyNavigate({ motion }) {
  const chain = useChain();
  if (
    motion?.externalProposals?.length !== 1 &&
    motion?.operateExternals?.length !== 1
  ) {
    return null;
  }

  const motionId = getUniqueMotionId(motion, chain);
  const external =
    motion.externalProposals?.[0] || motion.operateExternals?.[0];

  return (
    <NavigationWrapper>
      <MultiMotionNavigator
        motions={external.motions}
        type={detailPageCategory.COUNCIL_MOTION}
        pageMotionId={motionId}
      />
      <ExternalProposalNavigator external={external} />
      <ExternalTechCommMotionNavigator
        external={external}
        pageMotionId={motionId}
      />
      <ExternalCouncilMotionNavigator
        external={external}
        pageMotionId={motionId}
      />
      <ExternalReferendumNavigator external={external} />
      <ExternalTreasurySpendNavigator external={external} />
    </NavigationWrapper>
  );
}
