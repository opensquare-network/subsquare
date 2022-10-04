import { DemocracyProposalNavigator, NavigationWrapper, ReferendumNavigationItem } from "./navigators";

export default function DemocracyProposalNavigation({ proposalIndex, referendumIndex }) {
  return <NavigationWrapper>
    <DemocracyProposalNavigator proposalIndex={ proposalIndex } isLink={ false } />
    <ReferendumNavigationItem referendumIndex={ referendumIndex } />
  </NavigationWrapper>
}
