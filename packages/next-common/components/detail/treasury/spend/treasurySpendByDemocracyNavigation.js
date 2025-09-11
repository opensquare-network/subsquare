import { isNil } from "lodash-es";
import { useOnchainData } from "next-common/context/post";
import {
  DemocracyProposalNavigator,
  DemocracyReferendumNavigator,
  NavigationWrapper,
} from "next-common/components/detail/navigation/navigators";
import DemocracyReferendumLink from "../../navigation/common/democracyReferendumLink";
import TriangleRight from "next-common/assets/imgs/icons/arrow-triangle-right.svg";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import {
  ExternalCouncilMotionNavigator,
  ExternalProposalNavigator,
  ExternalTechCommMotionNavigator,
  MultiMotionNavigator,
} from "../../navigation/democracyNavigator";

export function TreasurySpendByDemocracyProposalNavigation() {
  const onchainData = useOnchainData();
  const { isByDemocracy, democracyReferendumDetail, index } = onchainData;

  if (!isByDemocracy) {
    return null;
  }

  const { publicProposalIndex, referendumIndex } = democracyReferendumDetail;

  if (isNil(publicProposalIndex)) {
    return null;
  }

  return (
    <NavigationWrapper>
      <DemocracyProposalNavigator proposalIndex={publicProposalIndex} />
      <DemocracyReferendumNavigator referendumIndex={referendumIndex} />
      <div>
        <TriangleRight />
      </div>
      Treasury Spend #{index}
    </NavigationWrapper>
  );
}

export function TreasurySpendByDemocracyExternalNavigation() {
  const onchainData = useOnchainData();
  const { isByDemocracy, democracyReferendum, index } = onchainData;

  if (!isByDemocracy) {
    return null;
  }

  const external = onchainData?.democracyExternalDetail;
  if (!external) {
    return null;
  }

  return (
    <NavigationWrapper>
      <MultiMotionNavigator
        motions={external?.motions}
        type={detailPageCategory.COUNCIL_MOTION}
      />
      <ExternalProposalNavigator external={external} />
      <ExternalTechCommMotionNavigator external={external} />
      <ExternalCouncilMotionNavigator external={external} />
      <TriangleRight />
      <DemocracyReferendumLink referendumIndex={democracyReferendum} />
      <div>
        <TriangleRight />
      </div>
      Treasury Spend #{index}
    </NavigationWrapper>
  );
}
